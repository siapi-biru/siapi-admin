const form = {
  firstname: {
    autoFocus: true,
    label: 'Settings.permissions.users.form.firstname',
    placeholder: 'e.g. Kai',
    type: 'text',
    validations: {
      required: true,
    },
  },
  lastname: {
    label: 'Settings.permissions.users.form.lastname',
    placeholder: 'e.g. Urip',
    type: 'text',
    validations: {
      required: true,
    },
  },
  email: {
    label: 'Settings.permissions.users.form.email',
    placeholder: 'e.g. urip.subekti13@gmail.com',
    type: 'email',
    validations: {
      required: true,
    },
  },
  username: {
    label: 'Auth.form.username.label',
    placeholder: 'e.g. Urip_Subekti',
    type: 'text',
    autoComplete: 'no',
    validations: {},
  },
};

export default form;
