import * as yup from 'yup';
import { translatedErrors } from 'siapi-helper-plugin';

const schema = yup.object().shape({
  name: yup.string().required(translatedErrors.required),
});

export default schema;
