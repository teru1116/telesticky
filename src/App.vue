<template>
  <div>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <router-view />
  </div>
</template>

<script>
import 'reset-css'
export default {}
</script>

<style lang="scss">
a, button {
  cursor: pointer;
}
a {
  &:hover{
    text-decoration: none!important;
  }
}
button {
  border: 0;
  outline: 0;
  &.md-button {
    background-color: #fff;
    margin: 0;
    &.primary-button {
      background-color: #7b68ee!important;
      color: #fff!important;
    }
  }
}
input[type="text"], textarea {
  font-size: 17px;
  letter-spacing: -.021em;
  padding-left: 15px;
  padding-right: 15px;
  border: 1px solid #d6d6d6;
  border-radius: 2px;
  color: initial;
  letter-spacing: normal;
  margin: 0;
  padding: 0 12px;
  font: 400 11px system-ui;
}
input[type="text"] {
  height: 34px;
}
textarea {
  padding-top: 8px;
  padding-bottom: 8px;
}

.content-header {
  position: relative;
  height: 40px;
  margin: 8px 0 0;
  border-bottom: 1px solid #d5d5d5;
  > * {
    position: absolute;
    bottom: 8px;
  }
  h2 {
    font-size: 28px;
    line-height: 28px;
  }
  .header-items {
    right: 0;
    > * {
      float: right;
      z-index: 3;
      margin-left: 16px;
    }
  }
}

.dialog-header {
  background-color: #7b68ee;
  height: 48px;
  padding: 0 16px;
  h2 {
    color: #fff;
    line-height: 48px;
    font-size: 20px;
  }
}

ul.form-items {
  > li {
    margin-bottom: 24px;
    h3 {
      color: #666;
      font-weight: 600;
      font-size: 14px;
      padding: 8px 0;
    }
    small {
      display: block;
      color: #666;
      font-size: 12px;
    }
    input[type="text"] {
      width: 240px;
      &.form-item-estimate {
        width: 80px;
      }
    }
    textarea {
      width: 100%;
      max-width: 100%;
      min-width: 100%;
    }
    span.input-estimation-unit {
      color: #666;
    }
    .md-icon {
      &.add-icon {
        color: #666;
      }
      &.clear-icon {
        color: #999;
      }
    }
    .multi-inputs {
      margin-bottom: 24px;
      ul {
        list-style: none;
        li {
          display: flex;
          margin-bottom: 8px;
          textarea {
            flex: 1;
            min-width: auto;
          }
          .md-button {
            width: 44px;
          }
        }
      }
      .md-button {
        min-width: 0;
      }
    }
  }
}

.md-checkbox {
  &.md-checked {
    .md-checkbox-container {
      background-color: #f58310!important;
      border-color: #f58310!important;
    }
  }
}

.md-stepper {
  .md-stepper-header {
    &.md-active {
      .md-stepper-number {
        background-color: #f58310!important;
      }
    }
    &.md-done {
      .md-stepper-number {
        background-color: #f58310!important;
      }
    }
    .md-stepper-text {
      font-size: 16px;
    }
  }
}

.md-dialog-container {
  background-color: #fff;
}
</style>
