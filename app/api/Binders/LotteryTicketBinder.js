export default class LotteryTicketBinder {
  bind(input) {
    try {

      const result = input.result
      const data = input.data
      
      if (result) {
        if (Array.isArray(data)) {
          return data.map(d => {
            return {code: d.ticketNumber}
          })
        }
        
        return [
          data.ticketNumber
        ] 
      }
      else {
        return null
      }
    }
    catch {
      return null
    }
  }
}