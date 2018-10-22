$(document).ready(() => {
  let email;

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
});

//Forgot password flow start
const confirmPasswordChangeFormSubmit = e => {
  const form = document.getElementById("confirmPasswordChangeForm");

  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");
  } else {
    form.classList.add("was-validated");

    email = document.getElementById("confirmEmail").value;

    const apiUrl = "http://localhost:3000/auth/forgotPasswordStart"; //Enter endpoint

    $.post(apiUrl, {
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      data: JSON.stringify(email),
      dataType: "json"
    })
      .done((data, statusText, res) => {
        console.log(res.status);
        switch (res.status) {
          case 201:
            $("#confirmPasswordChange").toggleClass("hidden");
            $("#forgotPassword").toggleClass("hidden");
            break;
        }
      })
      .fail(res => {
        switch (res.status) {
          case 400:
            constructDiv(
              res.message,
              "confirm-forgot-password-validation-text"
            );
            break;
          default:
            constructDiv(
              res.message,
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
      email: email,
      newPassword: postData.newPassword,
      confirmCode: postData.forgotPasswordCode
    };

    const apiUrl = "http://localhost:3000/auth/forgotPasswordComplete"; //Enter endpoint

    $.post(apiUrl, {
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      data: JSON.stringify(resetPasswordObject),
      dataType: "json"
    })
      .done((data, statusText, res) => {
        console.log(res.status);
        switch (res.status) {
          case 201:
            alert("Yay");
            $("#loginForm").toggleClass("hidden");
            $("#confirmPasswordChange").toggleClass("hidden");
            break;
        }
      })
      .fail(res => {
        switch (res.status) {
          case 400:
            constructDiv(res.message, "forgot-validation-text");
            break;
          default:
            constructDiv(res.message, "forgot-validation-text");
            break;
        }
      });
  }
  event.preventDefault();
};

//Login flow
const loginFormSubmit = e => {
  const postData = getFormData("formLogin");

  const loginObject = {
    email: postData.email,
    password: postData.password
  };

  console.log(loginObject);

  const apiUrl = "http://localhost:3000/auth/login";

  $.post(apiUrl, {
    headers: {
      "Content-Type": "application/json"
    },
    type: "POST",
    data: JSON.stringify(loginObject),
    dataType: "json"
  })
    .done((data, statusText, res) => {
      console.log(res.status);
      switch (res.status) {
        case 200:
          window.location.replace("http://localhost:4200"); //TODO - Change url
          break;
      }
    })
    .fail(res => {
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
    });

  e.preventDefault();
};

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
    email = postData.regEmail;

    if (postData.regPassword !== postData.regPasswordRepeat) {
      constructDiv("Passwords do not match", "register-validation-text");
    } else {
      const registrationObject = {
        email: postData.regEmail,
        name: postData.regFName,
        family_name: postData.regSName,
        password: postData.regPassword
      };
      console.log(registrationObject);

      const apiUrl = "http://localhost:3000/auth/register"; //Enter endpoint

      $.post(apiUrl, {
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        data: JSON.stringify(registrationObject),
        dataType: "json"
      })
        .done((data, statusText, res) => {
          console.log(res.status);
          switch (res.status) {
            case 201:
              alert("Yay");
              //TODO - Move redirects in here
              break;
          }
        })
        .fail(res => {
          switch (res.status) {
            case 400:
              constructDiv(res.message, "register-validation-text");
              break;
            default:
              constructDiv(res.message, "register-validation-text");
              break;
          }
        });

      e.preventDefault();
      $("#registerForm").toggleClass("hidden");
      $("#confirmationForm").toggleClass("hidden");
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
    const apiUrl = "http://localhost:3000/auth/confirm"; //endpoint

    var object = {
      confirmationCode,
      email
    };

    console.log(JSON.stringify(object));
    $.post(apiUrl, {
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      data: JSON.stringify(object),
      dataType: "json"
    })
      .done((data, statusText, res) => {
        console.log(res.status);
        switch (res.status) {
          case 201:
            window.location.replace("https://google.ie"); //TODO - Enter angular app location
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

    $("#loginForm").toggleClass("hidden");
    $("#confirmationForm").toggleClass("hidden");
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
