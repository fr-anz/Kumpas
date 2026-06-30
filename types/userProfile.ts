/** Locally stored emergency profile. Never synced unless the user opts in. */
export type UserProfile = {
  name: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  medicalNote: string;
  addressNote: string;
};
