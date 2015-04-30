(function () {
    "use strict";
    var auth = Windows.Security.Authentication.Web;
    var id = "432989090211833";
    var redirect = "https://www.facebook.com/connect/login_success.html";
    var response = "token";
    var scope = "email,user_birthday";
    function login() {
        var url =
          "https://www.facebook.com/dialog/oauth?client_id=" + id
              + "&redirect_uri=" + redirect + "&scope=" + scope +
              "&response_type=" + response;
        var uri = new Windows.Foundation.Uri(url);
        var ruri = new Windows.Foundation.Uri(redirect);
        return auth.WebAuthenticationBroker.
            authenticateAsync(auth.WebAuthenticationOptions.none, uri, ruri);
    }

    function facebook(at) {
        var url = "https://graph.facebook.com/me?access_token=" + at;
        return WinJS.xhr({ url: url, type: "get" });

    }

    function cargarDetalles() {
        var at = localStorage.at;
        facebook(at).then(
            function(res) {
                var datos = JSON.parse(res.response);
                var capa = document.getElementById("datos");
                var foto = document.createElement("img");
                foto.setAttribute("src", "https://graph.facebook.com/" +
                    datos.id + "/picture");
                capa.appendChild(foto);
                var txt = document.createTextNode(datos.name);
                capa.appendChild(txt);


                var f = new Date();
                var cumple =  new Date(datos.birthday);

                if (f.getMonth() == cumple.getMonth() && f.getDate() == cumple.getDate()) {

                    document.getElementById("cumple").innerHTML =
                        "FELICIDADES!!!!!! Es tu cumple";
                } else {
                    document.getElementById("cumple").innerHTML =
                    "No es tu cumple";
                }

                capa.style.display = "block";
                document.getElementById("login").style.display = "none";

            },
            function(err) {
                document.getElementById("login").style.display = "block";

            });

    }

    function descomponerRespuesta(r) {
        var datos = r.responseData;
        var d = datos.split("#");
        var d2 = d[1].split("&");
        var d3 = d2[0].split("=");
        localStorage.at = d3[1];


    }

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            if (localStorage.at) {
                cargarDetalles();
            }
            else {
                login().then(function(resp) {
                    descomponerRespuesta(resp);
                    cargarDetalles();
                });
            }
        }
    });
})();
