"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var c=e[n];c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(t,c.key,c)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}var TmAlert=function(){function n(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"body";_classCallCheck(this,n),this.id="tmalert".concat(Date.now());var e=document.createElement("div");e.setAttribute("id",this.id),e.setAttribute("class","tm-alert"),document.querySelector(t).appendChild(e)}return _createClass(n,[{key:"show",value:function(){var t=this,e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},n=e.title,c=void 0===n?"通知":n,i=e.close,a=void 0===i?function(){return null}:i,l=e.ok,o=void 0===l?function(){return null}:l,r=e.cancel,d=void 0===r?function(){return null}:r,s=e.head,v=void 0===s||s,u=e.okBtn,m=void 0===u||u,f=e.cancelBtn,y=void 0!==f&&f,h=e.closeBtn,b=void 0===h||h,k=e.okBtnText,p=void 0===k?"确定":k,_=e.cancelBtnText,C=void 0===_?"取消":_,S=e.content,x=void 0===S?"":S,g=e.mainCSS,q=void 0===g?"":g,w=document.querySelector("#".concat(this.id));w.style.display="block";var B=v?'<div class="tm-alert-head d-flex">\n      <div>'.concat(c,"</div>\n      ").concat(b?'<div class="tm-alert-close"></div>':"","\n    </div>"):"",E=y?'<div class="tm-alert-btn d-flex tm-alert-gray J_tm-alert-btn-cancel" >'.concat(C,"</div>"):"",T=m?'<div class="tm-alert-btn d-flex J_tm-alert-btn-ok">'.concat(p," </div>"):"",J='<div class="tm-alert-main" style="'.concat(q,'">\n      <div class="tm-alert-figure"></div>\n      ').concat(B,'\n      <div class="tm-alert-body">\n        ').concat(x?'<div class="tm-alert-content d-flex">'.concat(x,"</div>"):"",'\n        <div class="tm-alert-btns d-flex">\n          ').concat(E,"\n          ").concat(T,"\n        </div>\n      </div>\n    </div>");w.innerHTML=J;var L=document.querySelector("#".concat(this.id," .tm-alert-close"));L&&L.addEventListener("click",function(){t.close(),a()},!1);var P=document.querySelector("#".concat(this.id," .J_tm-alert-btn-cancel"));P&&P.addEventListener("click",function(){t.close(),d()},!1);var A=document.querySelector("#".concat(this.id," .J_tm-alert-btn-ok"));A&&A.addEventListener("click",function(){t.close(),o()},!1)}},{key:"close",value:function(){document.querySelector("#".concat(this.id)).style.display="none"}}]),n}();