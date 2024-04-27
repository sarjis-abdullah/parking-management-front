import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
const rules = {
  name: { required: helpers.withMessage("Name is required", required) },
  email: {
    required: helpers.withMessage("Email is required", required),
    email,
  },
  role: { required: helpers.withMessage("Role is required", required) },
  password: {
    required: helpers.withMessage("Password is required", required),
  },
  confirmPassword: {
    required: helpers.withMessage("Confirm password is required", required),
    sameAs: helpers.withMessage(
      "Doesn't match with password",
      sameAs(state.password)
    ),
  },
};

const validator = useVuelidate(rules, state, { $lazy: true });

export default {userRegisterRules, validator};
