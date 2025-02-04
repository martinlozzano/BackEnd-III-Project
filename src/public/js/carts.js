const purchaseBtn = document.getElementById("pruchase_btn")

purchaseBtn.addEventListener("click", async() => {
    await fetch("http://localhost:8080/api/carts/66ec2a6c4df6736b5255b97c/purchase" ,{method:"POST"})
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
})