class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
      handleSwatchInput();
    }, 500);

    const facetForm = this.querySelector('form');
    facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));

    const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
    if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    };
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    const countContainer = document.getElementById('ProductCount');
    const countContainerDesktop = document.getElementById('ProductCountDesktop');
    document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');
    if (countContainer) {
      countContainer.classList.add('loading');
    }
    if (countContainerDesktop) {
      countContainerDesktop.classList.add('loading');
    }

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = (element) => element.url === url;

      FacetFiltersForm.filterData.some(filterDataUrl)
        ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
        : FacetFiltersForm.renderSectionFromFetch(url, event);
    });

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
      window.location.reload();
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html);        
        FacetFiltersForm.renderProductCount(html);
        if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderProductCount(html);
    if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
  }

  static renderProductGridContainer(html) {
    document.getElementById('ProductGridContainer').innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('ProductGridContainer').innerHTML;
    document
      .getElementById('ProductGridContainer')
      .querySelectorAll('.scroll-trigger')
      .forEach((element) => {
        element.classList.add('scroll-trigger--cancel');
      });
  }

  static renderProductCount(html) {
    const count = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCount').innerHTML;
    const container = document.getElementById('ProductCount');
    const containerDesktop = document.getElementById('ProductCountDesktop');
    container.innerHTML = count;
    container.classList.remove('loading');
    if (containerDesktop) {
      containerDesktop.innerHTML = count;
      containerDesktop.classList.remove('loading');
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements = parsedHTML.querySelectorAll(
      '#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter'
    );
    const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest('.js-filter') : undefined;
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
    };
    const facetsToRender = Array.from(facetDetailsElements).filter((element) => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);

    if (countsToRender) FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
    });

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderAdditionalElements(html) {
    const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];

    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return;
      document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
    });

    document.getElementById('FacetFiltersFormMobile').closest('menu-drawer').bindEvents();
  }

  static renderCounts(source, target) {
    const targetElement = target.querySelector('.facets__selected');
    const sourceElement = source.querySelector('.facets__selected');

    const targetElementAccessibility = target.querySelector('.facets__summary');
    const sourceElementAccessibility = source.querySelector('.facets__summary');

    if (sourceElement && targetElement) {
      target.querySelector('.facets__selected').outerHTML = source.querySelector('.facets__selected').outerHTML;
    }

    if (targetElementAccessibility && sourceElementAccessibility) {
      target.querySelector('.facets__summary').outerHTML = source.querySelector('.facets__summary').outerHTML;
    }
  }

  static updateURLHash(searchParams) {
    if (searchParams.includes('filter.v.price.gte=') || searchParams.includes('filter.v.price.lte=')) {
      const regexGte = /filter\.v\.price\.gte=([^&]+)/;
      const regexLte = /filter\.v\.price\.lte=([^&]+)/;
      const matchLte = searchParams.match(regexLte);
      const matchGte = searchParams.match(regexGte);
      const maxInput =  document.querySelector('.filter__price_max');
      const maxInputValue =  maxInput.getAttribute('max');
      if (matchGte || matchLte) {
        const valueGte = matchGte[1];
        const valueLte = matchLte[1];  

        if (valueGte || valueLte) {
          switch (true) {
            case valueGte !== "0" && valueLte === maxInputValue:
                history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams).concat('&sort_by=price-ascending')}`); 
              break;
            case valueGte !== "0" && valueLte !== maxInputValue:
                history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams).concat('&sort_by=price-ascending')}`); 
              break;
            case valueGte === "0" && valueLte !== maxInputValue:
                history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams).concat('&sort_by=price-ascending')}`); 
              break;
            default:
                history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);    
              break; 
          }          
        } else {
          history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);    
        }
      } else {
        history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);    
      }
    } else {
      history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);    
    }
  }

  static getSections() {
    return [
      {
        section: document.getElementById('product-grid').dataset.id,
      },
    ];
  }

  createSearchParams(form) {
    const formData = new FormData(form);
    return new URLSearchParams(formData).toString();
  }

  onSubmitForm(searchParams, event) {
    FacetFiltersForm.renderPage(searchParams, event);
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const sortFilterForms = document.querySelectorAll('facet-filters-form form');
    if (event.srcElement.className == 'mobile-facets__checkbox') {
      const searchParams = this.createSearchParams(event.target.closest('form'));
      this.onSubmitForm(searchParams, event);
    } else {
      const forms = [];
      const isMobile = event.target.closest('form').id === 'FacetFiltersFormMobile';

      sortFilterForms.forEach((form) => {
        if (!isMobile) {
          if (form.id === 'FacetSortForm' || form.id === 'FacetFiltersForm' || form.id === 'FacetSortDrawerForm') {
            const noJsElements = document.querySelectorAll('.no-js-list');
            noJsElements.forEach((el) => el.remove());
            forms.push(this.createSearchParams(form));
          }
        } else if (form.id === 'FacetFiltersFormMobile') {
          forms.push(this.createSearchParams(form));
        }
      });
      this.onSubmitForm(forms.join('&'), event);
    }
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    const url =
      event.currentTarget.href.indexOf('?') == -1
        ? ''
        : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    FacetFiltersForm.renderPage(url);
  }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
    constructor() {
    super();
    this.priceRangeSlider();
    this.querySelectorAll('input').forEach((element) => {
        element.addEventListener('change', this.onRangeChange.bind(this))
    });
    this.setMinAndMaxValues();
  }
  
    onRangeChange(event) {
      this.adjustToValidValues(event.currentTarget);
      this.setMinAndMaxValues();
    }

    setMinAndMaxValues() {
      const inputs = this.querySelectorAll('input');
      const minInput = inputs[0];
      const maxInput = inputs[1];
      // if (maxInput.value) minInput.setAttribute('max', maxInput.value);
      // if (minInput.value) maxInput.setAttribute('min', minInput.value);
      if (minInput.value === '') maxInput.setAttribute('min', 0);
      if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
    }

    adjustToValidValues(input) {
      const value = Number(input.value);
      const min = Number(input.getAttribute('min'));
      const max = Number(input.getAttribute('max'));
  
      if (value < min) input.value = min;
      if (value > max) input.value = max;
    }

    priceRangeSlider() { 
      var rangeSlider = document.getElementById("priceRangeSlider");
      var rangeSliderMobile = document.getElementById("priceRangeSliderMobile");
      if (rangeSlider.noUiSlider) {
        return;
      }
      
      var minCollectionPrice = parseFloat($(".filter__price_min").val());
      var maxCollectionPrice = parseFloat($(".filter__price_max").val());
      var maxPrice = parseFloat($(".filter__price_max").attr("max"));

      var minCollectionPriceMobile = parseFloat($(".filter__price_min-mobile").val());
      var maxCollectionPriceMobile = parseFloat($(".filter__price_max-mobile").val());
      var maxPriceMobile = parseFloat($(".filter__price_max-mobile").attr("max"));
    
      var moneyFormat = wNumb({
        decimals: 0
      });

      noUiSlider.create(rangeSlider, {
        start: [minCollectionPrice, maxCollectionPrice],
        step: 1,
        range: { min: 0, max: maxPrice},
        format: moneyFormat,
        connect: true,
      });

      noUiSlider.create(rangeSliderMobile, {
        start: [minCollectionPriceMobile, maxCollectionPriceMobile],
        step: 1,
        range: { min: 0, max: maxPriceMobile},
        format: moneyFormat,
        connect: true,
      });
      
      rangeSlider.noUiSlider.on("change", (values, handle) => {
        this.handleRangeSliderUpdate(values, handle);
      });
      rangeSliderMobile.noUiSlider.on("change", (values, handle) => {
        this.handleRangeSliderUpdateMobile(values, handle);
      });
      rangeSlider.noUiSlider.on("update", (values, handle) => {
        document.getElementById("slider-value-min").innerHTML = values[0];
        document.getElementById("slider-value-max").innerHTML = values[1];
        $(".filter__price_min").val(moneyFormat.from(values[0]));
        $(".filter__price_max").val(moneyFormat.from(values[1]));
      });
      rangeSliderMobile.noUiSlider.on("update", (values, handle) => {
        document.getElementById("slider-value-min__mobile").innerHTML = values[0];
        document.getElementById("slider-value-max__mobile").innerHTML = values[1];
        $(".filter__price_min-mobile").val(moneyFormat.from(values[0]));
        $(".filter__price_max-mobile").val(moneyFormat.from(values[1]));
      });
    }

    handleRangeSliderUpdate(values, handle, isInitialLoad, maxPrice) {
      var moneyFormat = wNumb({
        decimals: 0
      });
      document.getElementById("slider-value-min").innerHTML = values[0];
      document.getElementById("slider-value-max").innerHTML = values[1];
      $(".filter__price_min").val(moneyFormat.from(values[0]));
      $(".filter__price_max").val(moneyFormat.from(values[1]));
      var maxPrice = $(".filter__price_max").attr("max");
    
      
        const urlParams = new URLSearchParams(window.location.search);
        const gteValue = urlParams.get('filter.v.price.gte');
        const lteValue = urlParams.get('filter.v.price.lte');
        
        if (gteValue === null && lteValue === null) {
          urlParams.set('filter.v.price.gte', values[0]);
          urlParams.set('filter.v.price.lte', values[1]);
        } else {
          urlParams.set('filter.v.price.gte', values[0]);
          urlParams.set('filter.v.price.lte', values[1]);
        }
        switch (true) {
          case values[0] !== "0" && values[1] === maxPrice:
            urlParams.set('sort_by', 'price-ascending');
            break;
          case values[0] !== "0" && values[1] !== maxPrice:
            urlParams.set('sort_by', 'price-ascending');
            break;
          case values[0] === "0" && values[1] !== maxPrice:
            urlParams.set('sort_by', 'price-ascending');
            break;
          case values[0] === "0" && values[1] === maxPrice:
            if (urlParams.has('sort_by')){
              urlParams.delete('sort_by');
            }
            break;
          default:
            if (urlParams.has('sort_by')){
              urlParams.delete('sort_by');
            }
            break;
        }
    
        let newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        history.pushState(null, '', newUrl);
        setTimeout(function() {
          window.location.href = newUrl;
        }, 500);                
    }  
  
    handleRangeSliderUpdateMobile(values, handle, isInitialLoad, maxPrice) {
      var moneyFormat = wNumb({
        decimals: 0
      });
      document.getElementById("slider-value-min__mobile").innerHTML = values[0];
      document.getElementById("slider-value-max__mobile").innerHTML = values[1];
      $(".filter__price_min-mobile").val(moneyFormat.from(values[0]));
      $(".filter__price_max-mobile").val(moneyFormat.from(values[1]));
      var maxPrice = $(".filter__price_max-mobile").attr("max");
    
      
        const urlParams = new URLSearchParams(window.location.search);
        const gteValue = urlParams.get('filter.v.price.gte');
        const lteValue = urlParams.get('filter.v.price.lte');
        
        if (gteValue === null && lteValue === null) {
          urlParams.set('filter.v.price.gte', values[0]);
          urlParams.set('filter.v.price.lte', values[1]);
        } else {
          urlParams.set('filter.v.price.gte', values[0]);
          urlParams.set('filter.v.price.lte', values[1]);
        }
        switch (true) {
          case values[0] !== "0" && values[1] === maxPrice:
            urlParams.set('sort_by', 'price-ascending');
            break;
          case values[0] !== "0" && values[1] !== maxPrice:
            urlParams.set('sort_by', 'price-ascending');
            break;
          case values[0] === "0" && values[1] !== maxPrice:
            urlParams.set('sort_by', 'price-ascending');
            break;
          case values[0] === "0" && values[1] === maxPrice:
            if (urlParams.has('sort_by')){
              urlParams.delete('sort_by');
            }
            break;
          default:
            if (urlParams.has('sort_by')){
              urlParams.delete('sort_by');
            }
            break;
        }
    
        let newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        history.pushState(null, '', newUrl);
        setTimeout(function() {
          window.location.href = newUrl;
        }, 500);                
    }  

  

// priceRangeSlider() {
//   var rangeSliders = document.getElementsByClassName("range-slider");

//   for (var i = 0; i < rangeSliders.length; i++) {
//     var rangeSlider = rangeSliders[i];

//     if (rangeSlider.noUiSlider) {
//       continue;
//     }

//     var minCollectionPrice = parseFloat($(".filter__price_min").eq(i).val());
//     var maxCollectionPrice = parseFloat($(".filter__price_max").eq(i).val());
//     var maxPrice = parseFloat($(".filter__price_max").eq(i).attr("max"));   

//     var moneyFormat = wNumb({
//       decimals: 0
//     });

//     noUiSlider.create(rangeSlider, {
//       start: [minCollectionPrice, maxCollectionPrice],
//       step: 1,
//       range: { min: 0, max: maxPrice },
//       format: moneyFormat,
//       connect: true,
//     });

//     rangeSlider.noUiSlider.on("change", (values, handle) => {
//       this.handleRangeSliderUpdate(values, handle);
//     });

//     rangeSlider.noUiSlider.on("update", (values, handle) => {
//       var index = handle;
//       var sliderValueMin = $(".slider-value-min").eq(index);
//       var sliderValueMax = $(".slider-value-max").eq(index);
    
//       sliderValueMin.text(values[0]);
//       sliderValueMax.text(values[1]);
    
//       $(".filter__price_min").eq(index).val(moneyFormat.from(values[0]));
//       $(".filter__price_max").eq(index).val(moneyFormat.from(values[1]));
//     });
//   }
// }

// handleRangeSliderUpdate(values, handle, isInitialLoad, maxPrice) {
//   var moneyFormat = wNumb({
//     decimals: 0
//   });

//   for (var i = 0; i < values.length; i++) {

//     var valueArray = values[i].split(",");
//     var minValue = parseFloat(valueArray[0]);
//     var maxValue = parseFloat(valueArray[0]);
//     console.log(valueArray)
//     var sliderValueMin = $(".slider-value-min").eq(i);
//     var sliderValueMax = $(".slider-value-max").eq(i);
//     var filterPriceMin = $(".filter__price_min").eq(i);
//     var filterPriceMax = $(".filter__price_max").eq(i);
//     var maxPriceAttr = filterPriceMax.attr("max");

//     sliderValueMin.text(minValue);
//     sliderValueMax.text(maxValue);

//     filterPriceMin.val(moneyFormat.from(minValue));
//     filterPriceMax.val(moneyFormat.from(maxValue));


//     const urlParams = new URLSearchParams(window.location.search);
//     const gteValue = urlParams.get('filter.v.price.gte');
//     const lteValue = urlParams.get('filter.v.price.lte');

//     if (gteValue === null && lteValue === null) {
//       urlParams.set('filter.v.price.gte', minValue);
//       urlParams.set('filter.v.price.lte', maxValue);
//     } else {
//       urlParams.set('filter.v.price.gte', minValue);
//       urlParams.set('filter.v.price.lte', maxValue);
//     }

//     switch (true) {
//       case values[i][0] !== 0 && values[i][1] === maxPriceAttr:
//         urlParams.set('sort_by', 'price-ascending');
//         break;
//       case values[i][0] !== 0 && values[i][1] !== maxPriceAttr:
//         urlParams.set('sort_by', 'price-ascending');
//         break;
//       case values[i][0] === 0 && values[i][1] !== maxPriceAttr:
//         urlParams.set('sort_by', 'price-ascending');
//         break;
//       case values[i][0] === 0 && values[i][1] === maxPriceAttr:
//         if (urlParams.has('sort_by')) {
//           urlParams.delete('sort_by');
//         }
//         break;
//       default:
//         if (urlParams.has('sort_by')) {
//           urlParams.delete('sort_by');
//         }
//         break;
//     }

//     let newUrl = `${window.location.pathname}?${urlParams.toString()}`;
//     history.pushState(null, '', newUrl);
//     // setTimeout(function() {
//     //   window.location.href = newUrl;
//     // }, 500);
//   }
// }



}

customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    const facetLink = this.querySelector('a');
    facetLink.setAttribute('role', 'button');
    facetLink.addEventListener('click', this.closeFilter.bind(this));
    facetLink.addEventListener('keyup', (event) => {
      event.preventDefault();
      if (event.code.toUpperCase() === 'SPACE') this.closeFilter(event);
    });
  }

  closeFilter(event) {
    event.preventDefault();
    const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
    form.onActiveFilterClick(event);
  }
}

customElements.define('facet-remove', FacetRemove);


