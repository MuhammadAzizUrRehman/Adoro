class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink)
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {this.classList.add('animate', 'active')});

    this.addEventListener('transitionend', () => {
      const containerToTrapFocusOn = this.classList.contains('is-empty') ? this.querySelector('.drawer__inner-empty') : document.getElementById('CartDrawer');
      const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
      trapFocus(containerToTrapFocusOn, focusElement);
    }, { once: true });

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if(cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') && this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    // this.fetchCrossSellProductsHandles(parsedState)
    this.getSectionsToRender().forEach((section => {
      const sectionElement = section.selector ? document.querySelector(section.selector) : document.getElementById(section.id);
      sectionElement.innerHTML =
          this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    }));

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    });
  }

// Fetch cross-sell products
  fetchCrossSellProductsHandles(product) {
    console.log("fetchCrossSellProducts ", product)
    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];

    let productHandle = product.handle;
    let This = this;
    // let url = `/products/${productHandle}?view=metafield-json`;
    $.ajax({
      url: '/products/'+productHandle+'?view=metafield-json',
      method: 'GET',
      dataType: 'html',
      success: function(data) {
        console.log("fetchCrossSellProducts response", data)
        let handleObject = JSON.parse(data);
        handleObject.metafield != null ? This.fetchCrossSellProducts(handleObject.metafield) : This.fetchCrossSellProducts("amber-8, amber-7")
        console.log("handleObject ", handleObject)
      }
    })
  }
  async fetchCrossSellProducts(producthandles) {
    console.log("producthandles", producthandles)
    let producthandlesArr = producthandles.split(", ");
    const productGrid = document.querySelector(".upsell_product_list");
    var That = this;
    productGrid.innerHTML = "";
    for (let [index, productHandle] in producthandlesArr) {
      console.log("product handles ", producthandlesArr);
      console.log("product " + producthandlesArr[index])
      const response = await fetch(
        window.Shopify.routes.root + "products/" + producthandlesArr[index] + ".js"
      );
      const product = await response.json();
      product['price_new'] = Shopify.currency.active+ window.numberWithCommas((product['price'] / 100));
      if(product['price'] != product['compare_at_price']) {
        product['price_varies_new'] = true;
        product['compare_at_price_new'] = Shopify.currency.active + window.numberWithCommas((product['compare_at_price'] / 100));
      } 
      product['variant_id'] = product.variants[0].id 
      var productJsonStringify = JSON.stringify(product)
      console.log("await response.json", product);
      var source   = document.getElementById("upsell-product-grid").innerHTML;
      var template = Handlebars.compile(source);
      var htmlCreated = template(product);
      productGrid.innerHTML += htmlCreated; 
      if (producthandlesArr.length == Number(index) + 1) {
        That.upsellEventlisteners();
        $('.upsell-container').css('display','flex')
      }
    }
  }
  upsellEventlisteners() { 
      console.log("upsellEventlisteners ")
    const upsellSelect = document.querySelectorAll(".upsell_product_item_select");
    const addTocart = document.querySelectorAll(".js-upsell-atc")
    upsellSelect.forEach((item) => {
      item.addEventListener("change", (event) => {
        //handle click  
        console.log("changedd")
        console.log(optionsValue)
        var optionSelectBox = window.findAncestor(event.target,"option_select_box");
        var optionsValue = optionSelectBox.querySelectorAll(".upsell_product_item_select");
        var baseSelector = optionSelectBox.querySelectorAll("[data-product-select] option");
        var formInput = optionSelectBox.querySelector("#js-upsell-variant-id");
        var valueString = "";
        console.log(optionsValue)
        optionsValue.forEach((item, index) => {
          console.log("item" + item.value)
          valueString = valueString + item.value;
          if(optionsValue.length > 1 && index == 0){
            valueString = valueString + " / ";
          } 
        })
        console.log(baseSelector.childNodes)
        baseSelector.forEach((item, index) => {
          console.log("item" + item.value)
          let optionValue = item.getAttribute("data-variant-value")
          console.log(optionValue + optionValue.length + " " + valueString + valueString.length )
          if(optionValue == valueString ){
            formInput.setAttribute("value",item.getAttribute("value"));
          } 
        })
        // baseSelector.querySelectorAll("[data-variant-value= " + valueString + "]").classList.add("foundddd")
        console.log("valueString " + valueString)
      });
    });
    addTocart.forEach((item) => {
      item.addEventListener("click", (event) => {
        console.log("testtt")
        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];
        var cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        let optionSelectBox = window.findAncestor(event.target,"option_select_box");
        var upsellForm = optionSelectBox.querySelector("form");
        console.log(upsellForm)
        const formData = new FormData(upsellForm);
        if (cart) {
        console.log("this is cart", cart.getSectionsToRender())
          formData.append('sections', cart.getSectionsToRender().map((section) => section.id));
          formData.append('sections_url', window.location.pathname);
          // this.cart.setActiveElement(document.activeElement);
        }
        
        config.body = formData;
        console.log("config.body ",formData.getAll('sections'))
        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            console.log("response", response)
              cart.renderContents(response);
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            // this.submitButton.classList.remove('loading');
            // if (cart && cart.classList.contains('is-empty')) cart.classList.remove('is-empty');
            // querySelector('.loading-overlay__spinner').classList.add('hidden');
          });
      })
    })
  }
// custom function end
  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer'
      },
      {
        id: 'cart-icon-bubble'
      }
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner'
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      }
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);
