import jwt, { JwtPayload } from "jsonwebtoken";

type SignOption = {
  expiresIn: string | number;
};

const DEFAULT_SIGN_OPTIONS: SignOption = {
  expiresIn: "1h",
};

export function signJwtAccessToken(payload: JwtPayload, options: SignOption = DEFAULT_SIGN_OPTIONS) {
  const token = jwt.sign(payload, process.env.SECRET_KEY!, options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!);
    return decoded as JwtPayload;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}
