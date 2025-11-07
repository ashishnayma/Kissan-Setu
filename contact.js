function handleSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  if (!name || !email || !message) {
    alert("⚠️ Please fill out all fields!");
    return;
  }

  alert(`✅ Thank you, ${name}! Your message has been sent successfully.`);
  document.getElementById("contactForm").reset();
}
