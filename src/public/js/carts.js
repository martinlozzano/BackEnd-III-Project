import loggerUtil from "../../utils/logger.util"

const purchaseBtn = document.getElementById("pruchase_btn")

purchaseBtn.addEventListener("click", async() => {
    await fetch("http://localhost:8080/api/carts/66ec2a6c4df6736b5255b97c/purchase" ,{method:"POST"})
        .then(res => res.json())
        .then(data => loggerUtil.INFO(data))
        .catch(error => loggerUtil.ERROR(error))
})