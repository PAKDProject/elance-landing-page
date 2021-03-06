$(document).ready(() => {
  let globalEmail;
  if (localStorage.getItem("access_token") && localStorage.getItem("id_token")) {
    var access_token = localStorage.getItem("access_token")
    var id_token = localStorage.getItem("id_token")
    window.location.replace(`https://app.intellilance.com/callback/auth?access_token=${access_token}&id_token=${id_token}`); //TODO - Change url
  }
  //Show or hide form based on selections on page
  $("#toggleRegisterPage").click(() => {
    $("#loginForm").toggleClass("hidden");
    $("#registerForm").toggleClass("hidden");
    $("#formRegister").removeClass("was-validated");
  });

  $("#toggleForgotPassword").click(() => {
    $("#loginForm").toggleClass("hidden");
    $("#confirmPasswordChange").toggleClass("hidden");
  });

  $("#confirmReturnToLogin").click(() => {
    $("#loginForm").toggleClass("hidden");
    $("#confirmPasswordChange").toggleClass("hidden");
  });

  $("#alreadyHaveAccount").click(() => {
    $("#loginForm").toggleClass("hidden");
    $("#registerForm").toggleClass("hidden");
    $("#formLogin").removeClass("was-validated");
  });

  $("#formLogin").submit(e => {
    loginFormSubmit(e);
  });

  $("#formRegister").submit(e => {
    registerFormSubmit(e);
  });
  $("#formConfirm").submit(e => {
    confirmationFormSubmit(e);
  });

  $("#confirmPasswordChangeForm").submit(e => {
    confirmPasswordChangeFormSubmit(e);
  });

  $("#formForgotPassword").submit(e => {
    forgotPasswordFormSubmit(e);
  });

  $("#privacyCheck").click(() => {
    privacyAgreed();
  })
});

//Send first request for autologin
const sendCookieResponse = () => {
  const apiUrl = "https://api.intellilance.com/auth/login";
  $.post(apiUrl, {
    headers: {
      "Content-Type": "application/json"
    },
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    type: "POST"
  })
    .done((data, statusText, res) => {
      switch (res.status) {
        case 200:
          window.location.replace(`https://app.intellilance.com/callback/auth?access_token=${JSON.parse(res.responseText).tokens.access_token}&id_token=${JSON.parse(res.responseText).tokens.id_token}`); //TODO - Change url
          break;
      }
    })
}
//Forgot password flow start
const confirmPasswordChangeFormSubmit = e => {
  const form = document.getElementById("confirmPasswordChangeForm");

  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");
  } else {
    form.classList.add("was-validated");

    globalEmail = document.getElementById("confirmEmail").value;

    const apiUrl = "https://api.intellilance.com/auth/forgot/start"; //Enter endpoint

    $.post(apiUrl, {
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      data: JSON.stringify({
        email: globalEmail
      }),
      dataType: "json"
    })
      .done((data, statusText, res) => {
        switch (res.status) {
          case 200:
            $("#confirmPasswordChange").toggleClass("hidden");
            $("#forgotPassword").toggleClass("hidden");
            break;
        }
      })
      .fail(res => {
        switch (res.status) {
          case 400:
            constructDiv(
              JSON.stringify(res.responseText).message,
              "confirm-forgot-password-validation-text"
            );
            break;
          default:
            constructDiv(
              JSON.stringify(res.responseText).message,
              "confirm-forgot-password-validation-text"
            );
            break;
        }
      });
  }
  event.preventDefault();
};

//Forgot password flow end
const forgotPasswordFormSubmit = e => {
  const form = document.getElementById("confirmPasswordChangeForm");
  const postData = getFormData("formForgotPassword");

  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");
  } else {
    form.classList.add("was-validated");

    const resetPasswordObject = {
      email: globalEmail,
      newPassword: postData.newPassword,
      confirmCode: postData.forgotPasswordCode
    };

    const apiUrl = "https://api.intellilance.com/auth/forgot/verify"; //Enter endpoint

    $.post(apiUrl, {
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      data: JSON.stringify(resetPasswordObject),
      dataType: "json"
    })
      .done((data, statusText, res) => {
        switch (res.status) {
          case 201:
            $("#loginForm").toggleClass("hidden");
            $("#forgotPassword").toggleClass("hidden");
            break;
        }
      })
      .fail(res => {
        switch (res.status) {
          case 400:
            constructDiv(JSON.parse(res.responseText).message, "forgot-validation-text");
            break;
          default:
            constructDiv(JSON.parse(res.responseText).message, "forgot-validation-text");
            break;
        }
      });
  }
  event.preventDefault();
};

const resendConfirmationCode = () => {
  const apiUrl = "https://api.intellilance.com/auth/revalidate"
  $.post(apiUrl, {
    headers: {
      "Content-Type": "application/json"
    },
    type: "POST",
    data: JSON.stringify({
      email: globalEmail
    }),
    dataType: "json"
  })
    .done((data, statusText, res) => {
      switch (res.status) {
        case 200:
          $("#loginForm").toggleClass("hidden");
          $("#confirmationForm").toggleClass("hidden");

          constructDiv("You were sent a new verification code", "confirmation-message");
          break;
      }
    })
    .fail(res => {
      switch (res.status) {
        case 403:
          constructDiv(JSON.parse(res.responseText).message, "login-validation-text");
          break;
        default:
          constructDiv(JSON.parse(res.responseText).message, "login-validation-text");
          break;
      }
    });

}
//Login flow
const loginFormSubmit = e => {
  const postData = getFormData("formLogin");

  const loginObject = {
    email: postData.email,
    password: postData.password
  };

  globalEmail = postData.email

  const apiUrl = "https://api.intellilance.com/auth/login";

  $.post(apiUrl, {
    headers: {
      "Content-Type": "application/json"
    },
    type: "POST",
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    data: JSON.stringify(loginObject),
    dataType: "json"
  })
    .done((data, statusText, res) => {
      switch (res.status) {
        case 200:
          let parsedData = JSON.parse(res.responseText)
          localStorage.setItem('access_token', parsedData.tokens.access_token)
          localStorage.setItem('id_token', parsedData.tokens.id_token)
          window.location.replace(`https://app.intellilance.com/callback/auth?access_token=${JSON.parse(res.responseText).tokens.access_token}&id_token=${JSON.parse(res.responseText).tokens.id_token}`); //TODO - Change url
          break;
      }
    })
    .fail(res => {
      if (JSON.parse(res.responseText).code === "UserNotConfirmedException") {
        resendConfirmationCode();
      } else {
        switch (res.status) {
          case 403:
            constructDiv(
              JSON.parse(res.responseText).message,
              "login-validation-text"
            );

            break;
          default:
            constructDiv("Login Failed", "login-validation-text");
            break;
        }
      }
    });

  e.preventDefault();
};

const privacyAgreed = () => {
  const privacyAgreed = document.getElementById("privacyCheck").checked;
  if (!privacyAgreed) {
    document.getElementById("registerFormSubmit").disabled = true;
  } else {
    document.getElementById("registerFormSubmit").disabled = false;
  }
}
//Register for app flow start
const registerFormSubmit = e => {

  const form = document.getElementById("formRegister");
  const postData = getFormData("formRegister");
  event.preventDefault();
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");
  } else {
    form.classList.add("was-validated");
    globalEmail = postData.regEmail;


    if (postData.regPassword !== postData.regPasswordRepeat) {
      constructDiv("Passwords do not match", "register-validation-text");
    } else {
      const registrationObject = {
        email: postData.regEmail,
        name: postData.regFName,
        family_name: postData.regSName,
        password: postData.regPassword
      };

      const apiUrl = "https://api.intellilance.com/auth/register"; //Enter endpoint

      $.post(apiUrl, {
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        data: JSON.stringify(registrationObject),
        dataType: "json"
      })
        .done((data, statusText, res) => {
          switch (res.status) {
            case 201:
              $("#registerForm").toggleClass("hidden");
              $("#confirmationForm").toggleClass("hidden");
              break;
          }
        })
        .fail(res => {
          switch (res.status) {
            case 400:
              constructDiv(JSON.parse(res.responseText).message, "register-validation-text");
              break;
            default:
              constructDiv(JSON.parse(res.responseText).message, "register-validation-text");
              break;
          }
        });

      e.preventDefault();

    }
  }
};
//Register for app flow end
const confirmationFormSubmit = e => {
  const form = document.getElementById("formConfirm");
  const postData = getFormData("formConfirm");

  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");
  } else {
    const confirmationCode = postData.confirmationCode;
    const apiUrl = "https://api.intellilance.com/auth/confirm"; //endpoint

    var object = {
      confirmationCode,
      email: globalEmail
    };

    $.post(apiUrl, {
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      data: JSON.stringify(object),
      dataType: "json"
    })
      .done((data, statusText, res) => {
        switch (res.status) {
          case 201:
            $("#loginForm").toggleClass("hidden");
            $("#confirmationForm").toggleClass("hidden");
            break;
        }
      })
      .fail(res => {
        switch (res.status) {
          case 403:
            constructDiv(res.message, "confirmation-validation-text");
            break;
          default:
            constructDiv(res.message, "confirmation-validation-text");
            break;
        }
      });


    e.preventDefault();
  }
};

//Construct a div with relevant feedback to errors throughout the page
const constructDiv = (messageText, locationID) => {
  $(`#${locationID}`).empty();
  $(`#${locationID}`).append(`<div class='loginFeedback'>${messageText}</div>`);
};

//Loop through form and extract form field values
const getFormData = formName => {
  const formElements = document.getElementById(formName).elements;
  const postData = {};
  for (var i = 0; i < formElements.length; i++) {
    if (formElements[i].type != "submit")
      postData[formElements[i].name] = formElements[i].value;
  }
  return postData;
};