
// Global Function

$(window).scroll(function() {
  manageDetailsPosition();
});
// General Function to find ancestor
window["findAncestor"] = function(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}
// General function to convert string to html
window["stringToHTML"] = function (str) {
    var dom = document.createElement('div');
    dom.innerHTML = str;
    return dom;
  };
// General Function to add number with comma
  window["numberWithCommas"] = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).on('click', '.js-scroll-to', function (event) {
event.preventDefault();
console.log('clicking window---')
let paddSpace = 65;
if (window.innerWidth < 1025) {
  paddSpace = 1265;
}
// window.scrollTo(0, 200);
$('html, body').animate({
    // scrollTop: $($.attr(this, 'href')).offset().top - paddSpace
    scrollTop: 500
}, 500);
});

var position = $(window).scrollTop();
var siteWidth = window.innerWidth;
var navElem = $('.js-.header-main');
var navClass = 'main-nav--sticky';

// filter color images function sort alpha 
const filterColorImages = function(imagesArr, color) {
return imagesArr.filter((img) => img.includes(`-${color}`) )
};
  const sortAlphaNum = (a, b) => {
const reA = /[^a-zA-Z]/g;
const reN = /[^0-9]/g;

const aA = a.replace(reA, "");
const bA = b.replace(reA, "");
if (aA === bA) {
  const aN = parseInt(a.replace(reN, ""), 10);
  const bN = parseInt(b.replace(reN, ""), 10);
  return aN === bN ? 0 : aN > bN ? 1 : -1;
} else {
  return aA > bA ? 1 : -1;
}
};

// end general function


$(document).ready(function(){
if ($('header').hasClass('has-sticky-nav')) {
$(window).scroll(function() {
  var scroll = $(window).scrollTop();
  if (scroll <= 1) {
    $('.top_head').removeClass('main-sticky-visible');
  } else {
    // console.log('scroll', scroll)
    $('.top_head').addClass('main-sticky-visible');
  }
});

}

// header menu drawer
// $('.js-mega-menu-item').hide();

$('summary.header__menu-item.list-menu__item').on('click', function() {

var activeClass = 'is-active';
var target = $(this).find('.js-mega-menu-on-click').data('target');
$('.' + activeClass).removeClass(':not(.splide__slide)'+activeClass);

$(this).find('.js-mega-menu-on-click').addClass(activeClass);
$('[data-item]').hide();
$('[data-item="'+target+'"]').show();
});
$('.js-mega-menu-close').on('click', function() {
var activeClass = 'is-active';
var overlay = $('.js-mega-menu__product');

overlay.fadeOut();
$('.' + activeClass).removeClass(':not(.splide__slide)'+activeClass);
}); 

// menuu drawer add class to main parent html
$('summary.header__menu-item.list-menu__item').on('click', function() {
var target = $(this).find('.js-on-click').data('onclick-target'); 
var targetClass = $(this).find('.js-on-click').data('onclick-class'); 
var targetClassBehavior = $(this).find('.js-on-click').data('do'); 

if(targetClassBehavior && targetClassBehavior === 'add') {
  $(target).addClass(targetClass);
} else if (targetClassBehavior && targetClassBehavior === 'remove') {
  $(target).removeClass(targetClass);
} else {
  $(target).toggleClass(targetClass);
}
});

$('.js-on-click').on('click', function() {
var target = $(this).data('onclick-target'); 
var targetClass = $(this).data('onclick-class'); 
var targetClassBehavior = $(this).data('do'); 

if(targetClassBehavior && targetClassBehavior === 'add') {
  $(target).addClass(targetClass);
} else if (targetClassBehavior && targetClassBehavior === 'remove') {
  $(target).removeClass(targetClass);
} else {
  $(target).toggleClass(targetClass);
}
});

// functions for produtc grid hover

var imageService = function(img, w, h = w) {
var imgSplit = img.split('.');
var imgFormat = imgSplit[imgSplit.length - 1];
var imgFirst = img.split('.'+imgFormat)[0];

return imgFirst + '_' + w + 'x' + h + '.' + imgFormat;
};  
var setColors = function(options, defaultColor) {
var colors = getOption(options, 'color');

if (colors) {
  return colors.values.map(function(color, index) {
    const colorsArray = color.split('/');
    const colorSlug = colorsArray.join('').replace(' ', '');
    const colorName = colorsArray.join('');
    const colorClass = colorsArray.length > 1 ? (colorsArray.length === 2 ? 'color--double' : 'color--triple') : '';
    const colorTemplate = (arr) => arr.map(c => `
      <span class="color-${c.replace(' ', '').toLowerCase()}"></span>
    `).join('');

    const colorChecked = (ind) => {
      if (defaultColor && defaultColor === colorName.toLowerCase()) {
        return true;
      }

      return index === 0;
    };

    return `
      <div class="color-item">
        <input id="mega-menu-color-${colorSlug.toLowerCase()}"
          type="radio"
          name="color"
          value="${colorSlug.toLowerCase()}"
          data-name="${colorName.toLowerCase()}"
          class="color-item__input js-mega-menu-options-color-radio"
          ${colorChecked(index) ? 'checked="checked"' : ''}>

        <label for="mega-menu-color-${colorSlug.toLowerCase()}"
          class="js-mega-menu-options-color color-item__label color-item__label--mega-menu ${colorClass}"
          data-color="${colorSlug.toLowerCase()}"
          title="${colorName.toLowerCase()}">
          <div>
            ${colorTemplate(colorsArray)}
          </div>
        </label>
      </div>
    `;
  }).join('');
}

return null;
};
var setOptions = function(options, defaultColor, template = '') {
var stock = template.includes('stock') ? true : false;

var colorSelected = () => {
  return  defaultColor && defaultColor === `${defaultColor}-7-`;
}

var colorOptionFormat = (option) => {
  var temp = option.title.replace(' / ', '-').split('/').join('').toLowerCase().replaceAll(' ', '');
  return `${temp.replaceAll(/["]/g, 'inch ')}-`;
}

return options.map(function(option) {
  return `<option value="${option.id}"
    ${defaultColor && `${defaultColor}-7-` === colorOptionFormat(option) ? 'selected="selected"' : '' }
    data-options="${colorOptionFormat(option)}" ${stock ? 'data-qty="'+option.inventory_quantity+'" data-policy="'+option.inventory_policy+'"' : ''}>${option.title.toLowerCase()}</option>`;
}).join('');
};
var setSizes = function(sizes) {
return sizes.values.map(function(option){
  return `<option value="${option.toString().replaceAll(/["]/g, 'inch')}">${option}</option>`;
}).join('');
};
var getOption = function(options, type) {
var option = options.filter(o => o.name.toLowerCase() === type);

return option.length > 0 ? option[0] : null;
};
function hasNumber(myString) {
return /\d/.test(myString);
}
var setType = function(tags, typeEl) {
var material = tags.filter(m => m.includes('material_'));

return material.length > 0 ? typeEl.html(material[0].replace('material_', '')).show() : typeEl.hide();
};
// fill related product template
var fillTemplate = function(product, template, cb) {
var variants = $('.js-mega-menu-product-variants');
var img = $('.js-mega-menu__img');
var title = $('.js-mega-menu__title');
var price = $('.js-mega-menu__price');
var url = $('.js-mega-menu__url');
var type = $('.js-mega-menu__type');
var size = $('.js-mega-menu__size');
var variantsWrapper = $('.js-mega-menu-size');
var colorsWrapper = $('.js-mega-menu-color-picker');
var cart = $('.js-mega-menu__cart');
var defaultColorArr = product.tags.filter(i => i.includes('default-color_'));
var defaultColor = product.variants[0].option1.replaceAll('/', '').toLowerCase();
  console.log('default color', defaultColor)
if (defaultColorArr.length > 0) {
  defaultColor = defaultColorArr[0].replace('default-color_', '').replaceAll('/', '').toLowerCase();
}
var defaultImage = () => {
  console.log('default running---')
  // if (defaultColor && !defaultColor.includes('default')) {
  //   console.log('condition fullfiling--', product.featured_image)
  //   return product.images.filter(i => i.includes(`color_${defaultColor}_1_`))[0];
  //   console.log('color image---', product.images.filter(i => i.includes(`color_${defaultColor}_1_`))[0]);
  // }
  // console.log('default image', product.featured_image)

  console.log('featured_img', product.featured_image)
  return product.featured_image;
  
};
var defaultUrl = () => {
  if (defaultColor) {
    var variantId = product.variants.filter(i => i.title.toLowerCase().includes(`${defaultColor} / 7`))[0].id;
    return `${product.url}?variant=${variantId}`;
  }

  return product.url;
}

cart.attr('disabled', false);
cart.html('<span>Add To Cart</span>');

img.fadeOut(function() {
  title.html(product.title.split(' -')[0]);
  price.html('$'+product.price / 100);
  url.attr('href', product.url);
  size.attr('href', product.url + '?whats-my-size=true');
  colorsWrapper.html(setColors(product.options, defaultColor));
  // defaultColor
  //console.log('------------------------', defaultImage())
  img.attr('src', imageService(defaultImage(), 365));
  img.fadeIn();

  variants.html(setOptions(product.variants, defaultColor, template));
  $('.js-mega-menu-product-variants option:first').attr('selected','selected');
  
  setType(product.tags, type);
  if (getOption(product.options, 'size') && getOption(product.options, 'size').values) {
    variantsWrapper.show();
    variantsWrapper.html(setSizes(getOption(product.options, 'size')));

    if (!product.type.toLowerCase().includes('shoe')) {
      $('.mega-menu__product-size').hide();
    } else {
      $('.mega-menu__product-size').show();
    }
  } else {
    variantsWrapper.html("");
    variantsWrapper.hide();
    $('.mega-menu__product-size').remove();
  }

  cb();
});
}; 
$('.js-mega-menu__cart').on('click', function(e) {
e.preventDefault();
e.stopPropagation();

if($(this).attr('disabled') !== undefined) {
  return false;
}

var variantId = $('.js-mega-menu-product-variants').val();

AddToCartLoading(true, $(this));

// ajaxAddToCart(variantId, 1, () => {
//   AddToCartLoading(false, $(this));
// });
  const config = fetchConfig('javascript');
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  delete config.headers['Content-Type'];
  var cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
  var productForm = document.querySelector(".js-megamenu-product-form");
  console.log(productForm)
  const formData = new FormData(productForm);
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
      if (cart && cart.classList.contains('is-empty')) cart.classList.remove('is-empty');
      querySelector('.loading-overlay__spinner').classList.add('hidden');
    });

});
// optiona changed func
// BM display sold out message
var soldOutNotification = function(inStockData) {
var cartBtn = $('.js-mega-menu__cart');
console.log('soldOutNotification trigger');
cartBtn.attr('disabled', false);
cartBtn.html('<span>Add To Cart</span>');
if ($(inStockData).data('qty') !== undefined && $(inStockData).data('policy').includes('deny')) {
  if (parseInt($(inStockData).data('qty')) < 1) {
    cartBtn.attr('disabled', true);
    cartBtn.html('<span>Sold Out</span>');
  } else {
    cartBtn.attr('disabled', false);
    cartBtn.html('<span>Add To Cart</span>');
  }
}
}

var onOptionsChanged = function() {
var variantsSelector = $('.js-mega-menu-product-variants');
var url = $('.js-mega-menu__url');
var productUrl = url.attr('href').split('?')[0];
var size = $('.js-mega-menu-size').val();
var color = $('.js-mega-menu-options-color-radio:checked').val();

if(size !== null) {
  size = size.replaceAll(' ', '');
}
var option1 = !!color && !!size ? option1=`${color}-${size}-` : option1=`${color}-`;
var option2 = !!color && !!size ? option2=`${size}-${color}-` : option2=`${size}-`;

variantsSelector.find('option').each(function() {
  $(this).attr('selected', false);

  var singleOption = $(this).data('options').replaceAll(' ', '');
  if (singleOption===option1.replaceAll(' ', '') || singleOption===option2.replaceAll(' ', '')) {
    $(this).attr('selected','selected');
    $(".js-megamenu-product-form [name='id']").val($(this).attr("value"))
    soldOutNotification($(this));
  }
});

url.attr('href', `${productUrl}?variant=${variantsSelector.val()}`);
};

$(document).on('change', '.js-mega-menu-size', onOptionsChanged);
$(document).on('click', '.js-mega-menu-color-picker .js-mega-menu-options-color-radio', onOptionsChanged);
// end
const AddToCartLoading = (state = false, btnEl = '.js-add-to-cart-btn') => {
const btn = $(btnEl);
const loading = '<div class="add-to-cart-loading"></div>';
const original = '<span>Add to cart</span>';

btn.html(state ? loading : original);

if (!state) {
  // simply.miniCartOpen();
} else {
  // simply.miniCartClose();
}
}
const ajaxAddToCart = (id, quantity, cb = () => null) => {
$.ajax({
  method: "POST",
  url: "/cart/add.js",
  dataType: 'json',
  data: {
    id,
    quantity,
  }
})
.done((response) => {
  // state.reRender = new Date().getTime();
  var cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
  cart.renderContents(response);
  cb();
});
};

// show product on hover
$('.js-mega-menu-product').on('mouseover', function(e) {
 console.log('product hovering---')
e.preventDefault();
e.stopPropagation();

$('.js-mega-menu-product').removeClass('is-active');
$(this).addClass('is-active');

var loader = $('.js-mega-menu-loader');
var overlay = $('.js-mega-menu__product');
var wrapper = $('.js-mega-menu__wrapper');
var productHandle = $(this).data('handle');

overlay.fadeIn();
loader.fadeIn();
wrapper.fadeOut();

var productData = {};
var productTemplate = '';

$.when(
  $.ajax({
    url: '/products/'+productHandle+'.js',
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      
     // const parser = new DOMParser();
     //  const document = parser.parseFromString(html, "text/html");
     //   $('.js-mega-menu__product').text(document);

      window.mmpi = data.images;
      productData = data;
    }
  }),
  $.ajax({
    url: '/products/'+productHandle,
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      productTemplate = data.product.template_suffix;
      console.log('product temp', productTemplate)
    }
  })
).then(function(){
  try {
    fillTemplate(productData, productTemplate, function() {
      loader.fadeOut();
      wrapper.fadeIn();
    });
  } catch(err) {
    loader.fadeOut();
    wrapper.fadeIn();
  }
});

});
// color swatch click
$('.js-mega-menu-color-picker').on('click', '.js-mega-menu-options-color', function() {
var mmImg = $('.js-mega-menu__img');
var newColor = $(this).data('color');
var newPhoto = filterColorImages(window.mmpi, newColor)[0];

mmImg.attr('src', imageService(newPhoto, 365));

$(`.js-mega-menu-color-picker .js-mega-menu-options-color-radio[value="${newColor}"]`).prop('checked', 'checked');
});
// end

})


// window scroll and doc ready animate sections

$(window).scroll(function(){
$('.js-on-show').each(function() {
  var target = $(this).data('onshow-target');
  var targetClass = $(this).data('onshow-class');

  if (isScrolledIntoView($(this))) {
    setTimeout(() => {
      $(this).find(target).addClass(targetClass || 'animate');
    }, 200);
  }
});
});

$(document).on('ready', function() {
$('.js-on-show').each(function() {
  var target = $(this).data('onshow-target');
  var targetClass = $(this).data('onshow-class');

  if (isScrolledIntoView($(this))) {
    setTimeout(() => {
      $(this).find(target).addClass(targetClass || 'animate');
    }, 200);
  }
});
});

function isScrolledIntoView(elem){
var $elem = $(elem);
var $window = $(window);

var docViewTop = $window.scrollTop();
var docViewBottom = docViewTop + $window.height();

var elemTop = $elem.offset().top;
var elemBottom = elemTop + ($elem.height() / 3);

return (elemBottom <= docViewBottom);
}


// header click toggle class
$(document).ready(function(){


$('.header__icon--menu').click(function(){
$('.header-wrapper').toggleClass('menu_open');
})
})

// colleciton filters
$(document).ready(function(){
var $productFilter = $('.js-product-filter');
var $allProducts = $('.js-all-products');
var $allProductsOverlay = $('.js-all-products-overlay');
var allProductActiveClass = "all-products__filters--active";
var productFilterActiveClass = "all-products__filter--active";

$allProductsOverlay.on('click', function() {
var $activeFilter = $('.'+productFilterActiveClass);
$activeFilter.removeClass(productFilterActiveClass);
$allProducts.removeClass(allProductActiveClass);
});

function toggleFilters() {
var $this = $(this)
var $activeFilter = $('.'+productFilterActiveClass);

if ($activeFilter.length > 0) {
  $activeFilter.not(this).removeClass(productFilterActiveClass);
}

if ($this.hasClass(productFilterActiveClass)) {
  $this.removeClass(productFilterActiveClass);
  $allProducts.removeClass(allProductActiveClass);
} else {
  $this.addClass(productFilterActiveClass);
  $allProducts.addClass(allProductActiveClass);
}
}

$productFilter.on('click', function() {
toggleFilters.call(this)
});

$productFilter.keydown(function(e) {
if(e.which == 13) {
  toggleFilters.call(this)
}
});

// filters stikcy on scroll

if ($('body').hasClass('collection--template')) {
var navEl = $('.js-all-products__filters');
var headerEl = $('.collection-hero'); 
var allProducts = $('.js-all-products');

$(window).scroll(function() {
  var overallHeader = $('.top_bar_nav');
  var mainHeader = $('.collection-hero');
  var mainHeaderHeight = overallHeader.innerHeight();
  var informationNavMaxTop = headerEl.innerHeight() - mainHeaderHeight;
  var scrollTop = $(window).scrollTop();

  if (scrollTop >= informationNavMaxTop) {
    navEl.addClass('all-products__filters--fixed');
    navEl.css('top',mainHeaderHeight+'px')
  } else {
    navEl.removeClass('all-products__filters--fixed');
  }
});
}
else if ($('body').hasClass('search--template')) {
var searchHeader = $('.template-search__header');
var navEl = $('.js-all-products__filters');
var allProducts = $('.js-all-products');

$(window).scroll(function() {
  const topNavBar = $('.top_bar_nav');
  const mainHeaderHeight = topNavBar.innerHeight();
  var informationNavMaxTop = searchHeader.innerHeight() + 56 - mainHeaderHeight;
  var scrollTop = $(window).scrollTop();
  if (scrollTop >= informationNavMaxTop) {
    navEl.addClass('all-products__filters--fixed');
    navEl.css('top',mainHeaderHeight+'px')
  } else {
    navEl.removeClass('all-products__filters--fixed');
  }
});
}
})


// product page scripts
var $=jQuery.noConflict();
$(document).ready(function(){
$('.js-open-retail-info').on('click', function () {
  $('html').addClass('modal--open product-is-open');
})
})

// $(document).ready(function(){
// // product page custom slider
// if($(window).width() < 786){
//   if($('body').hasClass('product--template')){
//   const checkMediaSlider = setTimeout(() => {
//     var mediaSlider = $('.js-slick-product-media');
//     mediaSlider.addClass('addingslider---')
//     var mediaSliderArrowPrev = $('body').find('.js-slick-product-media__prev');
//     var mediaSliderArrowNext = $('body').find('.js-slick-product-media__next');
//     var $status = $('body').find('.js-slick-product-media-counter');

//     console.log(mediaSlider)
//     mediaSlider.slick({
//       slidesToShow: 1,
//       slidesToScroll: 1,
//       arrows: false,
//       infinite: true
//     });

//     mediaSlider.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
//       var counter = (currentSlide ? currentSlide : 0) + 1;      
//       $status.text('0' + counter + ' / 0' + slick.slideCount);
//     });

//     mediaSliderArrowPrev.on('click', function() {
//       mediaSlider.slick('slickPrev');
//     });

//     mediaSliderArrowNext.on('click', function() {
//       mediaSlider.slick('slickNext');
//     });

//     if (mediaSlider.hasClass('slick-initialized')) {
//       clearInterval(checkMediaSlider);
//     }
//   }, 150);

   
//   }
// }  
// }) 

// cart upsell
$(document).ready(function(){
$('.upsell__close').click(function(){
  $('.upsell-container').addClass('upsell--hide')
})
})

// filters pass only one value
$(document).ready(function(){
$('.custom_filters .tag').on('click', function(e) {
e.preventDefault();
e.stopPropagation();

let pathFolders = window.location.pathname.split('/');
const tags = pathFolders.length > 3 ? pathFolders[3].split('+') : [];
let newTags = [];

if ($(this).data('action') && $(this).data('action') == 'remove' && tags.length > 0) {
  newTags = tags.filter(tag => !tag.includes($(this).data('type')));
} else {
  newTags = tags.filter(tag => !tag.includes($(this).data('type')));
  newTags.push($(this).data('tag'));
}

$(this).parent('.js-product-filter-list').find('.all-products__filter-item').removeClass('is-active');
$(this).parent().addClass('is-active');

pathFolders[3] = newTags.filter(nt => nt != '').join('+');
pathFolders = pathFolders.join('/');

window.location.href = pathFolders;
});
})

// product detail page
$(document).ready(function(){
if($('body').hasClass('product--template')){

var colorName = $('.swatch input[name="option-0"]:checked').attr('value');
$('.js-product-color-label').html(colorName);
 
$('.swatch-element').click(function(e){
  var colr = $(this).attr('data-value');
  variants_button(colr);
  $('fieldset.js.product-form__input.Color label[color='+ colr +']').trigger('click');
})

// product images on swatch click
  $('.swatch input[name="option-0"]').on('change', function() {
  if ($('.swatch input[name="option-0"]').val()) {
    if ($('.js-slick-product-images').hasClass('slick-initialized')) {
      $('.js-slick-product-images').slick('unslick');
    }

    color = $('.swatch input[name="option-0"]:checked').val();
    var colorName = $('.swatch input[name="option-0"]:checked').attr('value');
    $('.js-product-color-label').html(colorName);
    reRenderImages(color);
    if($(window).width() < 767){
        var color = color.toLowerCase();
        console.log('color--',color)
        // console.log('img_name',$("[img_name='`${color}`']"))
        var slideIndex = $('modal-opener[img_name="' + color + '"]').attr('data-slick-index');
        console.log('slideIndex',slideIndex)
        // var slideIndex = $(this).data('slide');
        $('.js-slick-product-media').slick('slickGoTo', slideIndex);

    }     
  }
});

const filterColorImages = function(imagesArr, color) {
  return imagesArr.filter((img) => img.includes(`-${color}`))
};
BM_initImageZoom();
}
})


// product zoom
$(window).resize(function(){
if($(window).width() < 1025) {
  $('.bm-image-zoom-js').trigger('zoom.destroy');
} else {
  $('.bm-image-zoom-js').zoom({
    on: 'click',
    magnify: 2
  });
}
})

function BM_initImageZoom() {
if ($(window).width() > 1024) {
  $('.bm-image-zoom-js').zoom({
    on: 'click',
    magnify: 2
  });
}
}

function imageService(img, w, h = w) {
var imgSplit = img.split('.');
var imgFormat = imgSplit[imgSplit.length - 1];
var imgFirst = img.split('.' + imgFormat)[0];

return imgFirst + '_' + w + 'x' + h + '.' + imgFormat;
}

function reRenderImages(color) {
const productImageEl = $('.custom_desk_imgs');
const images = filterColorImages(window.currentProduct.images, color);

var existingSrcs = productImageEl.find("img").map(function() {
  return $(this).attr("src");
}).get();

let filteredImages = [];
images.forEach(function(image) {
  const imageSrc = image.split('?')[0]; 
  filteredImages.push(imageSrc);
});
  
existingSrcs.forEach(function(src) {
  const srcWithOutQuery = src.split('?')[0];
  if (filteredImages.includes(srcWithOutQuery)) {
    console.log("true")
    productImageEl.find("img[src='" + src + "']").parent().remove();
  }
});
// productImageEl.prepend(`<div class="bm-image-zoom-js product__media media" style="padding-top: 100.0%;"><img class="" loading="lazy" src="${image}" data-src="${imageService(image, 1000)}, ${imageService(image, 750)} , ${imageService(image, 450)}, ${imageService(image, 150)}" alt="${window.currentProduct.title}" /></div>`)
images.reverse().forEach((image, index) => {
  const newImageElement = $(`<div class="bm-image-zoom-js product__media media" style="padding-top: 100.0%;"><img class="" loading="lazy" src="${image}" data-src="${imageService(image, 1000)}, ${imageService(image, 750)} , ${imageService(image, 450)}, ${imageService(image, 150)}" alt="${window.currentProduct.title}" /></div>`);
  productImageEl.prepend(newImageElement);    
  $('html, body').scrollTop(0);
});
BM_initImageZoom();
}

// drawer tabs
$(document).ready(function(){
 
$('.btns_holder .tab img.active').hide();
$('.btns_holder .tab').click(function(){
  
  $('.btns_holder .tab').removeClass('active');
  $(this).addClass('active');

  $('.btns_holder .tab img').show();
  $('.btns_holder .tab img.active').hide();
  $('.btns_holder .tab.active img.active').show();
  $(this).find('img:not(.active)').hide();
  
  var attr = $(this).attr('tab');
  $('.content_holder').hide();
  $('#' + attr).show();
})
})

function manageDetailsPosition(){
// product toolbar mobile

var productToolbarBodyClass = 'product-toolbar--visible';
var productFormButtons = $('.product-form__buttons');
if (productFormButtons.length > 0) {
var scrollTop = $(window).scrollTop();
if (scrollTop >= $('.product-form__buttons').offset().top) {
    $('body').addClass(productToolbarBodyClass);
  } else {
    $('body').removeClass(productToolbarBodyClass);
  }
}
}


$(document).ready(function(){
$('.js-product-scroll-top').on('click', function(){
var window = $(window);
const carousel = document.querySelector('.custom_mob_slid_holdr');
const carouselOffsetTop = carousel.offsetTop;
const carouselHeight = carousel.innerHeight;
let i = window.scrollY;

if (window.innerWidth < 1025) {
  const int = setInterval(() => {
    window.scrollTo(0, i);
    i -= 40;
    if (i <= carouselOffsetTop + carouselHeight) clearInterval(int);
  }, 5);
} else {
  $("html, body").animate({ scrollTop: 0 }, "slow");
}
});
$(".slideshow__slide").click(function(){
var link = $(this).find("a").attr("href");
if(link.length){
  window.location.href = link;
}
})
})

// product grid variant imgs change 

// $(document).on('click','body:not(.product--template) .swatch input', async function() {
//   var handle = $(this).data('handle');
//   var targetStr = $(this).data('target');
//   var target = $(`#${targetStr}`);
//   var targetSecondary = $(`#${$(this).data('target-secondary')}`);
//   var pImages = target.data('images').split(',');
//   var color = $(`[name="${$(this).attr('name')}"]:checked`).val();
//   target.attr('src', filterColorImages(pImages, color)[0]);
//   console.log('image',filterColorImages(pImages, color)[0])
//     target.attr('srcset', filterColorImages(pImages, color));
//   if (filterColorImages(pImages, color)[1]) {
//     targetSecondary.attr('src', filterColorImages(pImages, color)[1]);
//     targetSecondary.attr('srcset', filterColorImages(pImages, color)[1]);
//   }
// });


function handleSwatchInput() {
var swatchInputs = document.querySelectorAll('body:not(.product--template) .swatch input');

swatchInputs.forEach(function(input) {
  input.addEventListener('click', handleClick);
});
function handleClick() {
  var handle = this.dataset.handle;
  var targetStr = this.dataset.target;
  var target = document.querySelector(`#${targetStr}`);
  var targetSecondary = document.querySelector(`#${this.dataset.targetSecondary}`);
  var pImages = target.dataset.images.split(',');
  var color = document.querySelector(`[name="${this.name}"]:checked`).value;    
  target.src = filterColorImages(pImages, color)[0];
  target.srcset = filterColorImages(pImages, color);
  // console.log('image',filterColorImages(pImages, color)[0])
  
  if (filterColorImages(pImages, color)[1]) {
    targetSecondary.src = filterColorImages(pImages, color)[1];
    targetSecondary.srcset = filterColorImages(pImages, color)[1];
  }
}  
}

document.addEventListener('DOMContentLoaded', handleSwatchInput);

function clickCheckedRadioInputs() {
window.addEventListener('load', function() {
  const checkedRadios = document.querySelectorAll('input.swatches__input[type="radio"][checked]');
  checkedRadios.forEach(function(radio) {
    radio.click();      
  });
});
}
clickCheckedRadioInputs();

// end

// mobile menu custom
$(document).ready(function(){
$('ul.menu-drawer__menu.has-submenu.list-menu>li>.icon').click(function(){
  $(this).closest('li').toggleClass('custom_menu_open');
})
})

// product page zoom


// filters name
$(document).ready(function(){
if($('body').hasClass('collection--template')){
  var host = 'https://adoro-shoe.myshopify.com/collections';

  var url = window.location.href;
  var spltd_url = url.split('/');
  var act_url = spltd_url[spltd_url.length - 1];
  var constraint = "?constraint=";
  var baseUrl;
  url.includes("?") ?  baseUrl = url.split("?")[0] :  baseUrl = url;
  $('.tag--active').each(function(){
    var activ_txt = $(this).find('a:not(.remove_lnk)').text();
    $(this).closest('.collection-sidebar__group').find('.txt').text(activ_txt);
  })

  var screen = $(window).width();
  if(screen < 750) {
  $('.mobile_filter li.tag:not(.tag--remove) label').on('click',function(){
    console.log('clicking---')
    if($(this).closest('.tag').hasClass('tag--active')){
      $(this).closest('.tag').removeClass('tag--active');
      $(this).siblings("input[type='checkbox']").prop('checked',false);
      return false;
    }
  })
  }
  $('li.tag:not(.tag--remove)').on('click', function (e) {
    e.preventDefault(); 
    var tag = $(this).attr('tag')     
    if(screen < 750) {
      if($(this).hasClass('tag--active')){
        $(this).removeClass('tag--active')
        $(this).find("input[type='checkbox']").prop('checked',false);
        return false;
      }
      
    $(this).toggleClass("tag--active")
    $(this).siblings().removeClass("tag--active")
    $(this).siblings().find("input").attr( "checked", false )
    if($(this).hasClass('tag--active')){
      $(this).find("input").attr( "checked", true )
    }
    else {
      $(this).find("input").attr( "checked", false )
    }
  }
  else {      
    if($(this).closest('.collapsible-content__inner').find(".tag--active").length) {
      var alreadySelectedtag = $(this).closest('.collapsible-content__inner').find(".tag--active").attr("tag");
      url = url.replace(new RegExp("\\b"+alreadySelectedtag+"\\b"),tag);
      window.location.href = url
    }
    else if($(".custom_filters:not(.mobile_filter)").find(".tag--active").length) {
      url = url + "+" + tag;
      window.location.href = url
    }
    else {
      url = url + "/" + tag;
      window.location.href = url
    }
  }
});
  if(localStorage.getItem("grid") == "multiple-grid" && $(window).width() < 749) {
    $(".multiple-grid").addClass("active");
    $("#product-grid").addClass("multiple-grid-item")
  }
  else {
    $(".single-grid").addClass("active");
  }
}
$(".apply-filter span").click(function(){
  updateFilters()
})
$(".tag.tag--remove").click(function(e){
  e.preventDefault();
  let tagName = $(this).attr("data-tag");
  $(".mobile-facets li[tag="+ tagName + "]").removeClass("tag--active");
  updateFilters()
})

function updateFilters() {
  $(".mobile-facets .tag.tag--active").each(function(index){
    index == 0 ? constraint = constraint + $(this).attr("tag") : constraint = constraint + "+" + $(this).attr("tag");
  })
  window.location.href = baseUrl + constraint;
}
$(".grid-options span").click(function() {
  $(this).addClass("active");
  $(this).siblings().removeClass("active");
  console.log($(this).hasClass("multiple-grid"))
  localStorage.setItem("grid",$(this).attr("data-grid"))
  if($(this).hasClass("multiple-grid")) {
    $("#product-grid").addClass("multiple-grid-item")
  }
  else {
    $("#product-grid").removeClass("multiple-grid-item")
  }
})
})

// product variants unavailable on product page

function variants_button(color){
  color = color.toLowerCase()
  console.log(color)
    let selector = $(".variant_selector").find("."+color);
    selector.each(function(){
     let sizeVal = $(this).attr("data-size");
     console.log(sizeVal)
     if($(this).hasClass("available")) {
      console.log("available")
      $(".product-form__input.Size").find("[target="+ sizeVal +"]").addClass("available")
      $(".product-form__input.Size").find("[target="+ sizeVal +"]").removeClass("soldout")
     }
     else {
      console.log("soldout")
      $(".product-form__input.Size").find("[target="+ sizeVal +"]").addClass("soldout")
      $(".product-form__input.Size").find("[target="+ sizeVal +"]").removeClass("available")
     }
      // let opiton = option;
      // let opt_variant = option.getAttribute('variant')
      // let spltd_variant = opt_variant.split('-');
      // let only_color = spltd_variant.slice(0, spltd_variant.length-1);
      // let opt_color = only_color.join('-');
      // let opt_size = spltd_variant[spltd_variant.length-1];
      // let sizes = document.querySelector('.product-form__input.Size');
      // sizes.querySelectorAll('label').forEach(label => {
      //   let label_size = label;
      //   let size_btn = label.getAttribute('target');
      //   if(!opiton.classList.contains('available') && size_btn == opt_size && only_color == color){
      //      label_size.classList.add('soldout')
      //    }
      //   else if(size_btn == opt_size && only_color == color){
      //      label_size.classList.remove('soldout')
      //    }
      // })  
    })
   }
document.addEventListener('DOMContentLoaded', () => {
let body = document.querySelector('body');
if(body.classList.contains('product--template')){
  let color = document.querySelector('.product-form__input.Color input:checked').getAttribute('target');
  let size = document.querySelector('.product-form__input.Size input:checked').getAttribute('target');
  variants_button(color)
}
})

document.addEventListener('DOMContentLoaded', () => {
let body = document.querySelector('body');
if(body.classList.contains('custom_page')){
  let parent = document.querySelector('#MainContent').children;
  let id = parent.item(1).getAttribute('id');
  let arrow_scroll = document.querySelector('.header-main__scroll');
  arrow_scroll.setAttribute('href', '#'+id)
}
})

document.addEventListener('DOMContentLoaded', function() {
const mainWrap = document.querySelector('variant-radios .swatch .swatch-element.color');
if (mainWrap){
  const soldoutRadios = mainWrap.querySelectorAll('.soldout input[type="radio"]');
  const availableRadios = document.querySelectorAll('.available input[type="radio"]');
  const sizeRadio = document.querySelector('fieldset.product-form__input.Size input[type="radio"]');
  const sizeLabel = sizeRadio.nextElementSibling;
  
  soldoutRadios.forEach(function(radio) {
    radio.checked = false;
    radio.removeAttribute('checked');
    radio.nextElementSibling.setAttribute('disabled', 'disabled');
  });
  
  if (availableRadios.length > 0) {
    availableRadios[0].checked = true;
    availableRadios[0].setAttribute('checked', 'checked');
    availableRadios[0].click(); 
    const color = availableRadios[0].value;
    const colorName = availableRadios[0].getAttribute('value');
    document.querySelector('.js-product-color-label').innerHTML = colorName;
    reRenderImages(color);
  }
  if (sizeRadio && sizeRadio.checked) {
    sizeLabel.classList.remove('soldout');
  }
}
});

// select or click 2nd swatch
function swatch_click(){
  $('#product-grid .grid__item').each(function(){
     var index = $(this).attr('index');
     var color = $(this).attr('color');
     if(index != 1){
       $(this).find('.swatch-element').each(function(){
         var swatch_handle = $(this).attr('data-value');
         if(swatch_handle == color){
           $(this).addClass('active');   
           $(this).find('input').click();         
         }            
       });         
     }
  })
}
  

// select 2nd or related variant according to product repeating
// DEV [UM]
$(document).scroll(function(){
  swatch_click();
})
window.onload = function() {  
  swatch_click();    
};  

function priceRangeActive() {
const priceRangeInputMin = document.querySelectorAll('.filter__price_min');
const priceRangeInputMax = document.querySelectorAll('.filter__price_max');

priceRangeInputMin.forEach(function(input) {
  const minValue = parseInt(input.getAttribute('min'));
  const value = parseInt(input.value);

  if (minValue === 0 && value !== 0) {
    input.parentNode.classList.add('active');
  } else {
    input.parentNode.classList.remove('active');
  }
});

priceRangeInputMax.forEach(function(input) {
  const maxValue = parseInt(input.getAttribute('max'));
  const value = parseInt(input.value);

  if (value !== maxValue) {
    input.parentNode.classList.add('active');
  } else {
    input.parentNode.classList.remove('active');
  }
});
}

document.addEventListener('DOMContentLoaded', priceRangeActive);

window.onbeforeunload = function() {
window.scrollTo(0, 0);
};

// color option soldout state
function processSwatchElements() {
$("#product-grid .grid__item:not(.gone-through) .swatch-element").each(function(){
  const colorName = $(this).attr("data-color");
  const totalColorVariantCount = $(this).parent().siblings(".variant_selector").find(".color-"+colorName).length;
  const totalSoldoutCount = $(this).parent().siblings(".variant_selector").find(".color-"+colorName+ ".soldout").length;
  if(totalColorVariantCount == totalSoldoutCount){
    $(this).addClass("soldout");
    $(this).removeClass("available");
  }
  else {
    $(this).removeClass("soldout");
    $(this).addClass("available");
  }
});
}

$(document).ready(function(){
processSwatchElements();
});

document.addEventListener('DOMContentLoaded', function() {
const myDivs = document.querySelectorAll('.swatch .swatch-element.color.soldout');

myDivs.forEach((div) => {
  div.addEventListener('mouseover', () => {
    div.classList.add('disable-click');
  });

  div.addEventListener('mouseout', () => {
    div.classList.remove('disable-click');
  });
});
});


document.addEventListener('DOMContentLoaded', function() {
const elements = document.querySelectorAll('.disable-click');

elements.forEach((element) => {
  element.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
  });
});
});


function processSwatchElementsHomePage() {
$(".product-grid.grid .color_swatch_product_card .swatch-element").each(function(){
  const colorName = $(this).attr("data-color");
  const totalColorVariantCount = $(this).parent().siblings(".variant_selector").find(".color-"+colorName).length;
  const totalSoldoutCount = $(this).parent().siblings(".variant_selector").find(".color-"+colorName+ ".soldout").length;
  if(totalColorVariantCount == totalSoldoutCount){
    $(this).addClass("soldout");
    $(this).removeClass("available");
  }
  else {
    $(this).removeClass("soldout");
    $(this).addClass("available");
  }
});
}
$(document).ready(function(){
processSwatchElementsHomePage();
});
