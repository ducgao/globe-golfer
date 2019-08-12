export default class ChallengesBinder {
  bind(input) {
    try {
      const data = input.data
      if (Array.isArray(data)) {
        return data.map(item => {
          return {
            id: item.id,
            name: item.name,
            location: item.gofl_name,
            rating: item.rate,
            // avatar: item.avatar,
            about: item.about,
            metaData: [
              { key: "Level", value: "Tour Player" },
              { key: "Index", value: item.p_index },
              { key: "Match", value: item.match },
              { key: "Win", value: item.win },
            ]
          }
        })
      }
      else {
        return {
          result: false
        }
      }
    }
    catch {
      return {
        result: false
      }
    }
  }
}

// metaData: [
//   { key: "Level", value: "Tour Player" },
//   { key: "Index", value: "18" },
//   { key: "Match", value: "1225" },
//   { key: "Win", value: "173" }
// ],
// avatar: "https://usatgolfweek.files.wordpress.com/2019/07/gettyimages-1163432510.jpg",
// rating: 3,
// name: "Adrien",
// location: "Golf, New York",
// about: "Sharing my experience with aspiring golfer. I'm a golfer from New York. Sharing my experience with aspiring golfer."