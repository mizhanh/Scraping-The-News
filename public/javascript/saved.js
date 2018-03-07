/* global bootbox */
$(document).ready(function() {
  
  var savedArticleDisplay = $("#savedArticleDisplay");
  
  $(document).on("click", ".btn.delete", deleteArticle);
  $(document).on("click", ".btn.addNotes", articleNotes);
  $(document).on("click", ".btn.save", saveNote);
  $(document).on("click", ".btn.note-delete", deleteNote);


  // initPage kicks everything off when the page is loaded
  initPage();

  //==================================================================================
  // Initialize the page
  //==================================================================================
  function initPage(){
    savedArticleDisplay.empty();
    $.get("/api/headlines?saved=true").then(function(data) {
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    })
  }

  //==================================================================================
  // Empty display if no articles saved
  //==================================================================================
  function renderEmpty() {
    var emptyDisplay = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h2>Sorry there are no saved articles!</h2>",
        "</div>",
        "<div class='panel-heading text-center'>",
        "<h4>Would You Like to Browse Available Articles?</h4>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h5><a href='/'>Browse Articles</a></h5>",
        "</div>",
        "</div>"
      ].join("")
    );
    savedArticleDisplay.append(emptyDisplay);
  }

  //==================================================================================
  // Set up a panel for each article
  //==================================================================================
  function setPanel(article) {
    var panel = $(
      [
        "<div class='row'>",
        "<div class='col-md-8'>",
        "<h2 style='font-size:20px; color:white; font-weight:bold; background-color:#946a36; padding:10px;'>",
        "<a style='color:black' class='article-link' target='_blank' href='" + article.link + "'>", article.headline,"</a>",
        "</h2>",
        "</div>",
        "<div>",
        "<button style='background-color:#761604; color:#fff; margin-left:5px; margin-right: 10px; padding:6px 12px; font-size:14px; text-line:center; border-radius:5px; font-weight:400; border:2px solid #761604;' class='btn delete'>Delete</button>",
        "</div>",
        "<div>",
        "<button style='background-color:#0082ff; color:#fff; margin-left 20px; padding:6px 12px; font-size:14px; text-line:center; border-radius:5px; font-weight:400; border:2px solid #0082ff;' type='button' class='btn addNotes'>Add Notes</button>",
        "</div>",
        "<div class='col-md-10'>",
          "<p style='font-size:10px'><span style='font-weight:med; margin-left:10px; margin-top:10px;' class ='article-author'>" + article.author + "</p>",
          "<p style='font-size:16px'>" + "<span style='font-weight:med; margin-left:10px; margin-top:5px;' class ='article-summary'>" + article.summary + "</p>",
        "</div>",
        "<hr>",
        "</div>"

      ].join(""));
      panel.data("_id", article._id);
      return panel;
    }

  //==================================================================================
  // Saved articles rendering 
  //==================================================================================
  function renderArticles(articles) {
    
    var articleResults = [];

    for (var i = 0; i < articles.length; i++) {
      articleResults.push(setPanel(articles[i]))    
    }

    savedArticleDisplay.append(articleResults);
  } 

  //==================================================================================
  // Delete article 
  //==================================================================================
  function deleteArticle() {
  
    var articleToDelete = $(this).parents(".row").data();
    
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      if (data.ok) {
        initPage();
      }
    });
  }


  //==================================================================================
  // Set up notes modal for each article
  //==================================================================================
  function articleNotes() {

    var currentArticle = $(this).parents(".row").data();
    // Grab any notes with this headline/article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      // Constructing our initial HTML to add to the notes modal
      var modalBox = [
        "<div class='container text-center' style='background-color: blue'>",
        "<h4>Notes For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='10' cols='100'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");
      // Adding the formatted HTML to the note modal
      mbox.prompt({
        modalBox,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };

      $(".btn.save").data("article", noteData);
      // renderNotes will populate the actual note HTML inside of the modal we just created/opened
      renderNotes(noteData);
    });
  }

  //==================================================================================
  // Article notes rendering
  //================================================================================== 
  function renderNotes(data) {
    
    var notesArray = [];
    var currentNote;
    if (!data.notes.length) {
      currentNote = ["<li class='list-group-item'>", "No notes available.", "</li>"].join("");
      notesArray.push(currentNote);
    }
    else {
      for (var i = 0; i < data.notes.length; i++) {
        currentNote = $(
          [
            "<li class='list-group-item note'>",
            data.notes[i].noteBody,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>"
          ].join("")
        );
      
        currentNote.children("button").data("_id", data.notes[i]._id);
        // Adding currentNote to the notes array
        notesArray.push(currentNote);
      }
    }
    // Now append the notesArray to the note display inside the note modal
    $(".noteDisplay").append(notesArray);
  }


  //==================================================================================
  // Save a new note for the article
  //==================================================================================
  function saveNote() {
    
    var noteMsg;

    var createNote = $(".bootbox-body textarea").val().trim();
    
    if (createNote) {
      noteMsg = {
        _id: $(this).data("article")._id,
        noteBody: createNote
      };
      $.post("/api/notes", noteMsg).then(function() {
  
        mbox.hideAll();
      });
    }
  }

  //==================================================================================
  // Delete a note from the article
  //==================================================================================
  function deleteNote() {
  
    var noteToDelete = $(this).data("_id");
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      bootbox.hideAll();
    });
  }


});