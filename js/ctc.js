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
  <div style="position:relative;">\
    <div class="ctc-button ctc-icon" id="ht-ctc-icon" aria-hidden="true">\
      <img src="images/whatsapp.png" alt="WhatsApp" style="width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;">\
    </div>\
    <div class="ctc-badge" id="ht-ctc-badge" style="display:none">!</div>\
  </div>\
  <div class="ctc-label" id="ht-ctc-cta">Fale conosco pelo WhatsApp</div>';

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