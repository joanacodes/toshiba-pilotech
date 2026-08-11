// Pilotech Toshiba — interactions
(function(){
  "use strict";
  // Onglets produit (DESCRIPTIF GAMME / VIDÉOS / DOCUMENTATIONS / ACCESSOIRES)
  function initTabs(){
    document.querySelectorAll('[data-tab-group]').forEach(function(group){
      var tabs=group.querySelectorAll('[data-tab]');
      var panels=document.querySelectorAll('[data-panel="'+group.getAttribute('data-tab-group')+'"] [data-tab-content]') ;
      tabs.forEach(function(tab){
        tab.addEventListener('click', function(){
          tabs.forEach(function(t){ t.classList.remove('tab-active'); });
          tab.classList.add('tab-active');
          var name=tab.getAttribute('data-tab');
          document.querySelectorAll('[data-tab-content]').forEach(function(p){
            if(p.getAttribute('data-tab-content')===name) p.classList.remove('hidden');
            else p.classList.add('hidden');
          });
        });
      });
    });
  }
  function init(){ initTabs(); }
  if(document.readyState!=='loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
