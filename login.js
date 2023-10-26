const form = {
  email: document.querySelector("#email"),
  password: document.querySelector("#password"),
  submit: document.querySelector("input[type='submit']"),
};

async function initForm(){

}

async function loginWithDb(){

}

initForm()

form.submit.addEventListener("click", async (event) => {
  event.preventDefault();

  const loginURL = "http://localhost:5678/api/users/login";

  const formData = {
    email: form.email.value,
    password: form.password.value,
  };

  console.log(formData);

  try {
    const response = await fetch(loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    
    const data = await response.json();
    let test = ""
      
    if (response.ok) {
      test = {"type":"success",data}
    } else {
      test = {"type":"error",data}
    }

    console.log(test.data.token);

    if (data.error) {
      const wrongPwdDiv = document.querySelector(".wrong-pwd");
      wrongPwdDiv.textContent = "Adresse mail ou mot de passe incorrect";
    } else {
      console.log(data);
      sessionStorage.setItem("token", data.token);
      console.log(sessionStorage.getItem("token"));
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
});
