const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  emailjs.init({
    publicKey: "2JCQM_5MgbDp4ebYC",
  });

  emailjs.sendForm("service_c8azcc7", "template_jp4irn3", form)
   .then((response) => alert('Mensagem enviada com sucesso!'))
   .catch((error)=> {
    console.log(error);
    alert("Erro ao enviar a menasgem!")
   }); 

  console.log("passei aqui"); 
});