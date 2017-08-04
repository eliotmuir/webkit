
var SessionTimer = function() {
   var m_doRefresh = false;
   var m_RefreshTime = null;
   var m_Timer = {};
   
   var Refresh = function(App, Callback) {
      return function() {
         if(m_doRefresh) {
            Callback();
            window.clearTimeout(m_Timer);
            m_Timer = setTimeout(Refresh(App, Callback), m_RefreshTime);
            m_doRefresh = false;
         } else {
            user.logout(App);
         }
      }
   }
   
   this.create = function(refreshTime, App, Callback) {
      m_RefreshTime = refreshTime;
      m_Timer = setTimeout(Refresh(App, Callback), m_RefreshTime);
   }
   
   this.toggleRefresh = function() {
      m_doRefresh = true;
      console.log('Refreshing Session Timer', m_doRefresh, m_Timer);
   }
   
   this.clear = function() {
      window.clearTimeout(m_Timer);
   }
   
}