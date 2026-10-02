import argon2 from "argon2";

export const hashPass = async (pass: string) => {
  const hash = await argon2.hash(pass);

  return hash;
};

export const verifyHash = async (
  hashPass: string,
  pass: string,
): Promise<boolean> => {
  return argon2.verify(hashPass, pass);
};
