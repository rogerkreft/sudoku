package main

import (
	"html/template"
	"log"
	"net/http"
	"path"
	"strings"
)

var tpl = template.Must(template.ParseGlob(path.Join("templates", "*.html")))

func main() {
	http.HandleFunc("/favicon.ico", serveImg)
	http.HandleFunc("/img/", serveImg)
	http.HandleFunc("/css/", serveStyle)
	http.HandleFunc("/index.html", handle)
	http.HandleFunc("/", redirectToIndex)
	http.ListenAndServe(":80", nil)
}

func serveImg(w http.ResponseWriter, req *http.Request) {
	p := strings.TrimPrefix(req.URL.Path, "/img/")
	http.ServeFile(w, req, path.Join("img", p))
}

func serveStyle(w http.ResponseWriter, req *http.Request) {
	p := strings.TrimPrefix(req.URL.Path, "/css/")
	http.ServeFile(w, req, path.Join("css", p))
}

func handle(w http.ResponseWriter, req *http.Request) {
	err := tpl.ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		log.Fatalf("got an error executing template: [%v]", err)
	}
}

func redirectToIndex(w http.ResponseWriter, req *http.Request) {
	http.Redirect(w, req, "/index.html", http.StatusSeeOther)
}
