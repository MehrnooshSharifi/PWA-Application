const baseURL = "https://WSO2.gsafe.ir";
import Cookies from "js-cookie";
// Login| signUp USer
export async function Login(values) {
  let clientUserInfo = {
    id: values.id,
    phoneNumber: values.phoneNumber,
    userTypeId: values.userTypeId,
  };
  const url = baseURL + "/rose/gss/api/PWA/Login";
  console.log(url);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      //! "content-type": "application/json-patch+json",   this don't work for http and just work for https
      "content-type": "application/json",
      Authorization: "Bearer " + Cookies.get("Token"),
    },
    body: JSON.stringify(clientUserInfo),
  });
  const data = await res.json();
  return data;
}
// GetToken :
export async function GetToken(values) {
  let userInfo = {
    userName: values.userNationalCode,
    password: values.otp,
    scope: values.scope,
  };
  const url = baseURL + `/rose/gss/api/Token/GetToken`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });
  const data = await res.json();
  return data;
}
// TerminalInfoByUserId :
export async function TerminalInfoByUserId(userId, values) {
  let terminalInfo = {
    userId: userId,
    terminalId: values.terminalId,
  };
  const url = baseURL + `/rose/gss/api/PWA/TerminalInfoByUserId`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(terminalInfo),
  });
  const data = await res.json();
  return data;
}

export async function ChequeInquiry(terminlId, encryptedBase64) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + Cookies.get("Token"));

  const raw = JSON.stringify({
    terminalId: terminlId,
    encryptData: encryptedBase64,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  const res = await fetch(
    `${baseURL}/rose/gss/api/PWA/ChequeInquiry`,
    requestOptions
  );
  const data = await res.text();
  const jsonData = JSON.parse(data);
  return jsonData;
}
