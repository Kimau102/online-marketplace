// default login status as false
let loginStatus = false
let cart = "<a href='./cart.html'>我的購物車</a>"
let login = `
<button type="button" class="btn" id="login-button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">登入</button>

<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasRightLabel">登入</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
  <div class="container text-center">
  <div class="row item">
  </div>
  <div class="col-md-12 login" id="login-form-area">

  </div>
</div>
  </div>
</div>
`

// get login status
export function loadNavItems() {
  window.addEventListener('load', reloadItems())
}
loadNavItems()

async function reloadItems() {
  const res = await fetch('/checkLogin')
  // console.log('get:',res.status)
  if (res.status === 200) {
    const resJson = await res.json()
    console.log(`welcome user ${resJson.username} with ID: ${resJson.id}`)
    loginStatus = true
    cart = `<a href='./cart.html?user_id=${resJson.id}'>我的購物車</a>`
    document.querySelector('#nav_cart').innerHTML = cart
    login = `<button type="button" class="btn" id="login-button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">查看帳戶</button>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">查看帳戶</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
          <div class="container text-center">
          <div class="row item">
          </div>
          <div class="col-md-12 login" id="login-form-area">
        
          </div>
        </div>
          </div>
        </div>`
    document.querySelector('#login').innerHTML = login
    if (window.location.pathname.includes("login.html")) {
      document.querySelector("#login-button").click();
    }
  } else if (res.status === 203) {
    console.log(
      'navbar: user not found / not yet login after checking with DB'
    )
    loginStatus = false
  } else {
    console.log(
      `navbar: user not found? / not yet login? res.status: ${res.status}`
    )
    loginStatus = false
  }
}

const navbar = document.querySelector('.item')
navbar.innerHTML = `
    <div class="col-md-3">
    <a href="./about.html">文心書居</a>
    </div>
    <div class="col-md-3">
    <a href="./index.html">購買書本</a>
    </div>
    <div class="col-md-3" id="nav_cart">
    ${cart}
    </div>
    <div class="col-md-3" id="login">
    ${login}
    </div>
    `
