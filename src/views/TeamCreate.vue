<template>
  <div>
    <ul
      v-for="(member, index) in invitingMembers"
      :key="index"
    >
      <li>
        <input
          v-model="member.email"
          placeholder="メールアドレスを入力して招待"
        >
        <button
          @click="removeInput(index)"
        >
          x
        </button>
      </li>
    </ul>
    <button
      @click="addInput"
    >
      +
    </button>
    <button>
      スクラムチーム作成
    </button>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      invitingMembers: []
    }
  },
  methods: {
    addInput: function () {
      this.invitingMembers.push(
        {
          'email': ''
        }
      )
    },
    removeInput: function (index) {
      this.invitingMembers.splice(index, 1)
    }
  },
  created: function () {
    for (let i = 0; i < 3; i++) {
      this.addInput()
    }
  }
}
</script>
