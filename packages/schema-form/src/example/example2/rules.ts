
export const validateVolume = [
  {
    required: false,
    trigger: ['blur', 'input'],
    validator(_rule, value) {
      if (value) {
        const rulesVolume = /^(\/(?!-){1}[\w-.]+[\w-])*$/;
        if (rulesVolume.test(value)) {
          return true;
        } else {
          return new Error(
            'the volume strings which you enter are illegal, please try again with new strings'
          );
        }
      }
      return true;
    }
  }
];