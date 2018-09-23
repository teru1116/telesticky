export default {
  async fetchAuthUsers (members) {
    // member.emailを渡して、Authenticationからユーザー情報を取得するAPI
    const url = 'http://localhost:5000/web-scrum-board/us-central1/getUsersWithEmails'
    // const url = 'https://us-central1-web-scrum-board.cloudfunctions.net/getUsersWithEmails'

    const response = await fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        members: members
      }),
      mode: 'cors'
    })

    return response.json()
  }
}
