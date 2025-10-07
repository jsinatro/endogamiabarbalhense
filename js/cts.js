/* js/ctc.js - Click to Chat adaptado para site estático */
(function(){
  // CONFIGURAÇÃO: altere aqui
  var NUMBER = "5511996495465"; // <-- SEU NÚMERO (ex: 5511996495465)
  var PREFILLED = "Olá! Vi seu site e gostaria de conversar."; // mensagem pré-preenchida (pode ficar vazia "")
  var TARGET_BLANK = true; // abre em nova aba (true) ou na mesma (false)

  function onClickHook(obj){
    // se quiser integração com analytics, adicione aqui
    // ex: if(window.gtag) gtag('event','click_to_chat', { 'number': obj.number });
  }

  // Geração do HTML do botão caso queira injetar dinamicamente.
  // Se preferir colar o HTML manualmente no index.html, este bloco não é necessário.
  if (!document.getElementById('ht-ctc-chat')) {
    var wrapper = document.createElement('div');
    wrapper.id = 'ht-ctc-chat';
    wrapper.setAttribute('role','button');
    wrapper.setAttribute('aria-label','Abrir conversa via WhatsApp');
    wrapper.tabIndex = 0;
    wrapper.innerHTML = '\
      <p class="ctc-cta" id="ht-ctc-cta">Fale conosco</p>\
      <div class="ctc-icon" id="ht-ctc-icon" aria-hidden="true">\
        <!-- svg reduzido -->\
        <svg style="pointer-events:none; display:block; height:100%; width:100%;" viewBox="0 0 1219.547 1225.016" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false">\
          <defs><linearGradient id="htwaicona-chat" x1="609.77" y1="1190.114" x2="609.77" y2="21.084" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#20b038"/><stop offset="1" stop-color="#60d66a"/></linearGradient></defs>\
          <path fill="#E0E0E0" d="M1041.858 178.02C927.206 63.289 774.753.07 612.325 0 277.617 0 5.232 272.298 5.098 606.991c-.039 106.986 27.915 211.42 81.048 303.476L0 1225.016l321.898-84.406c88.689 48.368 188.547 73.855 290.166 73.896h.258.003c334.654 0 607.08-272.346 607.222-607.023.056-162.208-63.052-314.724-177.689-429.463zm-429.533 933.963h-.197c-90.578-.048-179.402-24.366-256.878-70.339l-18.438-10.93-191.021 50.083 51-186.176-12.013-19.087c-50.525-80.336-77.198-173.175-77.16-268.504.111-278.186 226.507-504.503 504.898-504.503 134.812.056 261.519 52.604 356.814 147.965 95.289 95.36 147.728 222.128 147.688 356.948-.118 278.195-226.522 504.543-504.693 504.543z"/>\
          <path fill="url(#htwaicona-chat)" d="M27.875 1190.114l82.211-300.18c-50.719-87.852-77.391-187.523-77.359-289.602.133-319.398 260.078-579.25 579.469-579.25 155.016.07 300.508 60.398 409.898 169.891 109.414 109.492 169.633 255.031 169.57 409.812-.133 319.406-260.094 579.281-579.445 579.281-.023 0 .016 0 0 0h-.258c-96.977-.031-192.266-24.375-276.898-70.5l-307.188 80.548z"/>\
        </svg>\
      </div>';
    document.body.appendChild(wrapper);
  }

  var container = document.getElementById('ht-ctc-chat');
  var icon = document.getElementById('ht-ctc-icon');
  var cta = document.getElementById('ht-ctc-cta');

  function openWhatsApp() {
    var text = PREFILLED || "";
    var encoded = encodeURIComponent(text);
    var url = "https://api.whatsapp.com/send?phone=" + encodeURIComponent(NUMBER);
    if (encoded) url += "&text=" + encoded;
    onClickHook({number: NUMBER, text: PREFILLED, url: url});
    if (TARGET_BLANK) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }
  }

  if (icon) icon.addEventListener('click', openWhatsApp);
  if (cta) cta.addEventListener('click', openWhatsApp);

  container.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openWhatsApp();
    }
  });

  var touchTimeout;
  icon.addEventListener('touchstart', function(){
    container.classList.add('ctc-open');
    clearTimeout(touchTimeout);
    touchTimeout = setTimeout(function(){ container.classList.remove('ctc-open'); }, 2500);
  });

  // Expor api mínima
  window.HT_CTC = { open: openWhatsApp, config: { number: NUMBER, prefilled: PREFILLED } };
})();
