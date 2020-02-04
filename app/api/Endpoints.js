// const BASE = "http://ec2-54-251-181-28.ap-southeast-1.compute.amazonaws.com:8080/golfer_api/api/"
// const BASE = "http://14.225.5.44:8080/golfer_api/api/"
// const BASE = "http://ec2-13-229-72-73.ap-southeast-1.compute.amazonaws.com:8080/golfer_api/api/"
// const BASE = "http://ec2-54-169-5-52.ap-southeast-1.compute.amazonaws.com:8080/golfer_api/api/"
// const BASE = "http://ec2-54-169-178-30.ap-southeast-1.compute.amazonaws.com:8080/golfer_api/api/"
//prod
export const BASE = "http://18.140.90.148:8080/golfer_api/api/"
//dev
// export const BASE = "http://14.225.5.44:8080/golfer_api/api/"

export const LOGIN = BASE + "login"
export const GET_COUNTRY = BASE + "country"
export const GET_REGION = BASE + "region/{countryId}"
export const GET_CLUB = BASE + "club/{regionId}"

export const REGISTER = BASE + "user-add"

export const GET_FRIEND_LIST = BASE + "authenticated/friend/{userId}"
export const GET_CHALLENGES = BASE + "authenticated/challenge/list-info"
export const GET_PROFILE = BASE + "authenticated/profile"
export const GET_INTEREST = BASE + "authenticated/list-interest"

export const ADD_INTEREST = BASE + "authenticated/add-user-interest"
export const REMOVE_INTEREST = BASE + "authenticated/delete-user-interest"

export const GET_NEW_NOTIFICATIONS = BASE + "authenticated/notification/list-new/{tag}?limit=0&item=100"
export const GET_HISTORY_NOTIFICATIONS = BASE + "authenticated/notification/list-history/{tag}?limit=0&item=100"
export const UPDATE_NOTIFICATION = BASE + "authenticated/notification/update/{id}"

export const CHALLENGE_SOME_ONE = BASE + "authenticated/add-challenge"

export const GET_PENDING_MATCHES = BASE + "authenticated/pendings/list-new?limit=0&item=100"
export const GET_PLAYED_MATCHES = BASE + "authenticated/played?limit=0&item=100"

export const ACCEPT_CHALLENGE = BASE + "authenticated/match-challenge/{id}"
export const DECLINE_CHALLENGE = BASE + "authenticated/not-yet-challenge/{id}"

export const GET_RANKING = BASE + "authenticated/ranking/1"
export const GET_FAVORITE_RANKING = BASE + "authenticated/ranking/2"

export const CREATE_NEW_GAME = BASE + "authenticated/schedule"
export const GET_GAME_MODE = BASE + "authenticated/formule"

export const GET_CHAT_MATCHES = BASE + "authenticated/list-conversation/matchs"
export const GET_CHAT_FRIENDS = BASE + "authenticated/list-conversation/friends"

export const GET_AVATAR = BASE + "avatar/{id}"
export const CREATE_MATCH = BASE + "authenticated/schedule"

export const GET_MATCH_INFO = BASE + "authenticated/result-detail/{id}"
export const UPDATE_MATCH_RESULT = BASE + "authenticated/result"

export const CHAT_WS = BASE + "ws?access_token=434dd7ed8a7194bb30cc313a995c4a0c"

export const GET_MATCH_RESULT = BASE + "authenticated/result/notification/{id}"
export const ACCEPT_MATCH_RESULT = BASE + "authenticated/schedule/accept-result?id={id}&tag=1"

export const GET_ADS = BASE + "authenticated/advertisement/type/2"
export const VIEW_ADS = BASE + "authenticated/advertisement/image/{image}"

export const DELETE_ACCOUNT = BASE + "authenticated/delete-user"
export const MODIFY_PASSWORD = BASE + "authenticated/change-password"

export const APPLY_SUBSCRIPTION = BASE + "authenticated/transactions"

export const SIMPLE_UPDATE_MATCH_RESULT = BASE + "authenticated/schedule/result"
export const SIMPLE_GET_MATCH_RESULT = BASE + "authenticated/schedule/result/{id}"

export const CREATE_CONVERSATION = BASE + "authenticated/add-conversation/matchs/{id}"

export const LOTTERY = BASE + "authenticated/lottery"
export const LOTTERY_DETAIL = BASE + "authenticated/lottery/{id}"
export const LOTTERY_IMAGE = BASE + "authenticated/award/image/{id}"
export const LOTTERY_GET_TICKET = BASE + "authenticated/lottery/ticket/{id}"

export const RANKING_FRIENDS = BASE + "authenticated/friends/ranking/"
export const RANKING_CLUB = BASE + "authenticated/clubs/ranking/"
export const RANKING_PREMIUMS = BASE + "authenticated/premiums/ranking/"
export const RANKING_USER_CLUB = BASE + "authenticated/clubs/user/ranking/"

export const UPDATE_LOCATION = BASE + "authenticated/location"

export const UPDATE_READ_MESSAGE = BASE + "authenticated/conversation/{id}"

