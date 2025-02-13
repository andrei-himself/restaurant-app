import menuArray from "/data.js"

const itemsList = document.getElementById("menu-items-section")
const orderSection = document.getElementById("order-section")
const paymentModal = document.getElementById("payment-modal")
const paymentForm = document.getElementById("payment-form")

paymentForm.addEventListener('submit', e => {
    removeAll()
    togglePaymentModal()
    processPayment()
    e.preventDefault()
})

let itemsHtml = ''

menuArray.forEach(item => {
    itemsHtml += `
        <div class="item-container">
                <div class="item-entry">
                    <img src="${item.photo}" alt="${item.photoAlt}">
                    <div class="item-details">
                        <h2>${item.name}</h2>
                        <p class="ingredients">${item.ingredients.join(', ')}</p>
                        <p class="price">$${item.price}</p>
                    </div>
                </div>
                <button data-add-to-order="${item.id}">+</button>
            </div>
    `
});
itemsList.innerHTML += itemsHtml

document.addEventListener('click', function (e) {
    if (e.target.dataset.addToOrder){
        modifyOrder(e.target.dataset.addToOrder)
    } else if (e.target.dataset.removeFromOrder) {
        removeFromOrder(e.target.dataset.removeFromOrder)
    } else if (e.target.dataset.removeAll === "remove-all-btn") {
        removeAll()
    } else if (e.target.dataset.completeOrder === "complete-order-btn") {
        togglePaymentModal()
    } else if (e.target.dataset.cancelPayment === "cancel-payment-btn") {
        togglePaymentModal()
    }
})

let orderItems = []

function modifyOrder(clickedId) {
    for (const item of menuArray) {
        if (clickedId === item.id) {
            orderItems = [...orderItems, item]
            break
        }
    } 

    renderOrder()
}

function removeFromOrder(clickedId) {
    for (let i = 0; i < orderItems.length; i++) {
        if (clickedId === orderItems[i].id) {
            if (i === 0 && orderItems.length === 1) {
                removeAll()
            } else {
                orderItems.splice(i, 1)
                renderOrder()
                break
            } 
        }
    } 
}

function removeAll() {
    orderItems = []
    orderSection.innerHTML = ''
}

function renderOrder() {
    let orderHtml = ''
    let totalPrice = 0

    orderItems.forEach(item => {
        orderHtml += `
            <li>
                <div class="order-item">
                    <p>${item.name}</p>
                    <button class="remove-btn" data-remove-from-order="${item.id}">remove</button>
                </div>
                <p class="item-price">$${item.price}</p>
            </li>
        `
        totalPrice += item.price
    })

    orderSection.innerHTML = `
        <h2>Your order</h2>
        <ul id='order-list'>${orderHtml}</ul>
        <div class="order-summary"><p>Total price:</p><p>$${totalPrice}</p></div>
        <div class="order-btn-wrap">
            <button class="order-btn" data-complete-order="complete-order-btn">Complete Order</button>
            <button class="remove-all-btn" data-remove-all="remove-all-btn">Remove All</button>
        </div>  
    `
}

function togglePaymentModal() {
    paymentModal.classList.toggle("display-none")
}

function processPayment() {
    const paymentFormData = new FormData(paymentForm)
    const name = paymentFormData.get('customerName')
    const confirmModal = document.getElementById("confirm-modal")
    confirmModal.classList.toggle("display-none")
    confirmModal.innerHTML = `
        Thanks, ${name}! Your order is on its way!
    `
}