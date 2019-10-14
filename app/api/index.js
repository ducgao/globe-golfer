import Base from './Base'
import { 
  DUMMY_MESSAGES,
} from './DummyData'
import { LOGIN, GET_COUNTRY, GET_REGION, GET_CLUB, REGISTER, GET_CHALLENGES, GET_PROFILE, GET_INTEREST, GET_NEW_NOTIFICATIONS, GET_HISTORY_NOTIFICATIONS, CHALLENGE_SOME_ONE, UPDATE_NOTIFICATION, GET_PENDING_MATCHES, ACCEPT_CHALLENGE, GET_RANKING, DECLINE_CHALLENGE, GET_FAVORITE_RANKING, GET_GAME_MODE, ADD_INTEREST, REMOVE_INTEREST, GET_CHAT_MATCHES, GET_CHAT_FRIENDS, CREATE_MATCH, GET_MATCH_INFO, UPDATE_MATCH_RESULT, GET_MATCH_RESULT, ACCEPT_MATCH_RESULT, GET_ADS } from './Endpoints';
import LoginBinder from './Binders/Login';
import CountriesBinder from './Binders/CountriesBinder';
import RegisterBinder from './Binders/RegisterBinder';
import RegistrationHelper from './RegistrationHelper';
import ChallengesBinder from './Binders/ChallengesBinder';
import ProfileBinder from './Binders/ProfileBinder';
import InterestBinder from './Binders/InterestBinder';
import NotificationBinder from './Binders/NotificationBinder';
import MatchInfoBinder from './Binders/MatchInfoBinder';
import RankingBinder from './Binders/RankingBinder';
import GameModeBinder from './Binders/GameModeBinder';
import moment from 'moment';
import MatchDetailBinder from './Binders/MatchDetailBinder';
import CreateMatchBinder from './Binders/CreateMatchBinder';
import MessageBinder from './Binders/MessageBinder';

import MatchResultBinder from './Binders/MatchResultBinder';
import AdsBinder from './Binders/AdsBinder';

export default class Api extends Base {
  static _instance = null
  static instance() {
      if (this._instance == null) {
          this._instance = new Api()
      }
      
      return this._instance
  }

  currentUserProfile = undefined;

  setCurrentUserProfile(profile) {
    this.currentUserProfile = profile;
  }

  dummData(data) {
    return new Promise((resolve, rejecter) => {
      setTimeout(() => {
        resolve(data)
      }, 1000);
    })
  }

  getCountries() {
    return this.callGet(GET_COUNTRY, new CountriesBinder())
  }

  getRegions(countryId) {
    const callingApi = GET_REGION.replace("{countryId}", `${countryId}`)
    return this.callGet(callingApi, new CountriesBinder())
  }

  getClubs(regionId) {
    const callingApi = GET_CLUB.replace("{regionId}", `${regionId}`)
    return this.callGet(callingApi, new CountriesBinder())
  }

  register() {
    const helper = RegistrationHelper.instance();
    const body = {
      email: helper.email,
      password: helper.password,
      first_name: helper.firstName,
      last_name: helper.lastName,
      date_of_born: helper.birthDay,
      sex: helper.gender,
      p_index: helper.index,
      golfCourseId: helper.club,
      avatar: helper.avatar.uri
    }

    var addition = {
      email: helper.email
    }

    if (helper.facebookId) {
      addition = {
        facebookId: helper.facebookId
      }
    } else if (helper.googleId) {
      addition = {
        googleId: helper.googleId
      }
    }

    const callingBody = {...body, ...addition}

    return new Promise((resolve, rejecter) => {
      this.callPost(REGISTER, JSON.stringify(callingBody), new RegisterBinder())
        .then(result => {
          if (result.result === true) {
            if (helper.email) {
              this.login(helper.email, helper.password)
                .then(data => resolve(data))
                .catch(e => rejecter(e))
            }
            else if (helper.facebookId) {
              this.loginFacebook(helper.facebookId, helper.facebookToken)
                .then(data => resolve(data))
                .catch(e => rejecter(e))
            }
            else if (helper.googleId) {
              this.loginGoogle(helper.googleId, helper.googleToken)
                .then(data => resolve(data))
                .catch(e => rejecter(e))
            }
          }
          else {
            rejecter()
          }
        })
        .catch(e => rejecter(e))
    })
  }

  login(email, password) {
    const body = JSON.stringify({
      username: email,
	    password: password
    })
    return this.callPost(LOGIN, body, new LoginBinder())
  }

  loginGoogle(id, token) {
    const body = JSON.stringify({
      googleId: id,
	    googleToken: token
    })
    
    return this.callPost(LOGIN, body, new LoginBinder())
  }

  loginFacebook(id, token) {
    const body = JSON.stringify({
      facebookId: id,
	    facebookToken: token
    })
    return this.callPost(LOGIN, body, new LoginBinder())
  }

  getChallenges() {
    return this.callGet(GET_CHALLENGES, new ChallengesBinder())
  }

  getPendingMatches() {
    return this.callGet(GET_PENDING_MATCHES, new MatchInfoBinder())
  }

  getPlayedMatches() {
    return this.dummData([])
  }

  getMessages(tag) {
    if (tag == 0) {
      return this.getMatchesChatList()
    }
    else if (tag == 1) {
      return this.getFriendsChatList()
    }
    else {
      return this.dummData(DUMMY_MESSAGES)
    }
  }

  getNewNotifications(tag) {
    const callingApi = GET_NEW_NOTIFICATIONS.replace("{tag}", tag + 1);
    return this.callGet(callingApi, new NotificationBinder())
  }

  getHistoryNotifications(tag) {
    const callingApi = GET_HISTORY_NOTIFICATIONS.replace("{tag}", tag + 1);
    return this.callGet(callingApi, new NotificationBinder())
  }

  getFavoriteRanking(tag) {
    return this.callGet(GET_FAVORITE_RANKING, new RankingBinder());
  }

  getAllRanking(tag) {
    return this.callGet(GET_RANKING, new RankingBinder());
  }

  getProfile() {
    return this.callGet(GET_PROFILE, new ProfileBinder());
  }

  updateProfile(objToUpdate) {
    return new Promise((resolve, rejecter) => {
      this.callPut(GET_PROFILE, JSON.stringify(objToUpdate)).then(_ => {
        this.getProfile().then(resolve).catch(rejecter)
      })
      .catch(rejecter)
    })
  }

  getInterest() {
    return this.callGet(GET_INTEREST, new InterestBinder());
  }

  challengeTo(userId) {
    const body = JSON.stringify({
      user_from: this.currentUserProfile.id,
      user_to: userId,
      status: 0
    })

    return this.callPost(CHALLENGE_SOME_ONE, body);
  }

  addInterest(userId, interestId) {
    const body = JSON.stringify({
      userId,
      interestId
    })

    return this.callPost(ADD_INTEREST, body)
  }

  removeInterest(userId, interestId) {
    const body = JSON.stringify({
      userId,
      interestId
    })

    return this.callPost(REMOVE_INTEREST, body)
  }

  updateNotificationStatus(id) {
    const callingApi = UPDATE_NOTIFICATION.replace("{id}", id)
    return this.callPut(callingApi);
  }

  acceptChallenge(id) {
    const callingApi = ACCEPT_CHALLENGE.replace("{id}", id)
    return this.callGet(callingApi)
  }

  declineChallenge(id) {
    const callingApi = DECLINE_CHALLENGE.replace("{id}", id)
    return this.callGet(callingApi)
  }

  getGameMode() {
    const callingApi = GET_GAME_MODE
    return this.callGet(callingApi, new GameModeBinder())
  }

  getMatchesChatList() {
    return this.callGet(GET_CHAT_MATCHES, new MessageBinder())
  }

  getFriendsChatList() {
    return this.callGet(GET_CHAT_FRIENDS, new MessageBinder())
  }

  createMatch(gameId, courseId, challengeId) {
    const body = JSON.stringify({
      id_course : courseId,
      id_challenge : challengeId,
      date_play : moment().format("YYYY-MM-DD - HH:mm:ss"),
      id_formuler: gameId
    })

    return this.callPost(CREATE_MATCH, body, new CreateMatchBinder())
  }

  getMatchInfo(id) {
    const callingApi = GET_MATCH_INFO.replace("{id}", id)

    return this.callGet(callingApi, new MatchDetailBinder())
  }

  updateGameResult(game) {
    const body = JSON.stringify({
      list: game
    })

    return this.callPost(UPDATE_MATCH_RESULT, body)
  }

  getMatchResult(notificationId) {
    const callingApi = GET_MATCH_RESULT.replace("{id}", notificationId)
    return this.callGet(callingApi, new MatchResultBinder())
  }

  acceptMatchResult(scheduleId) {
    const callingApi = ACCEPT_MATCH_RESULT.replace("{id}", scheduleId)
    return this.callPost(callingApi)
  }

  getAds() {
    return this.callGet(GET_ADS, new AdsBinder())
  }
}