
$(document).ready(function() {
  
  var savedArticleDisplay = $("#savedArticleDisplay");
  
  $(document).on("click", ".btn.delete", deleteArticle);
  $(document).on("click", ".btn.notes", articleNotes);
  $(document).on("click", ".btn.note-delete", deleteNote);

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
  // Set up a display for each article
  //==================================================================================
  function dataDisplay(article) {
    var display = $(
      [
        "<div class='row'>",
        "<div class='col-md-8'>",
        "<h2 style='font-size:20px; color:white; font-weight:bold; background-color:#946a36; padding:10px;'>",
        "<a style='color:black' class='article-link' target='_blank' href='" + article.link + "'>", article.headline,"</a>",
        "</h2>",
        "</div>",
        "<div>",
        "<button style='background-color:#761604; color:#fff; margin-top:5px; margin-left:5px; margin-right: 10px; font-size:14px; text-line:center; border-radius:5px; font-weight:400; border:2px solid #761604;' class='btn delete'>Delete</button>",
        "</div>",
        "<div>",
        "<button style='background-color:#0082ff; color:#fff; margin-top:5px; margin-left 10px; font-size:14px; text-line:center; border-radius:5px; font-weight:400; border:2px solid #0082ff;' type='button' class='btn notes'>Article Notes</button>",
        "</div>",
        "<div class='col-md-10'>",
          "<p style='font-size:10px'><span style='font-weight:med; margin-left:10px;' class ='article-author'>" + article.author + "</p>",
          "<p style='font-size:16px'>" + "<span style='font-weight:med; margin-left:10px;' class ='article-summary'>" + article.summary + "</p>",
        "</div>",
        "<hr>",
        "</div>"

      ].join(""));
      display.data("_id", article._id);
      return display;
    }

  //==================================================================================
  // Saved articles rendering 
  //==================================================================================
  function renderArticles(articles) {
    
    var articleResults = [];

    for (var i = 0; i < articles.length; i++) {
      articleResults.push(dataDisplay(articles[i]))    
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
      url: "/api/headlines/" + articleToDelete._id,
    }).then(function(data) {

      $.alert({
        theme: 'dark',
        columnClass: 'col-md-6 col-md-offset-3',
        title: "Article " + articleToDelete._id,
        content: 'has been deleted',
        type: 'blue',
      });

      if (data.ok) {
        initPage();
      }
    });
  }

  //==================================================================================
  // Add new notes in modal for each article
  //==================================================================================
  function articleNotes() {

    var currentArticle = $(this).parents(".row").data();
    var noteData;
    var noteArray = [];
    var currentNote;

    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      console.log(currentArticle._id);

      //model to input and save a new note for the article
        $.confirm({
          theme: 'dark',
          columnClass: 'col-md-8 col-md-offset-2',
          title: 'Notes for ' + currentArticle._id,
          content: '' + 
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            '<label>Notes</label>' +
            '<input type="textarea" placeholder="Enter notes or comment here" class="note form-control" required />' +
            '</div>' +
            '</form>',
          buttons: {
            formSubmit: {
                text: 'Save',
                btnClass: 'btn-blue',
                action: function () {
                  var createNote = this.$content.find('.note').val();
                  noteData = {
                    _id: currentArticle._id,
                    noteBody: createNote
                    };

                  $.post("/api/notes", noteData).then(function() {
                    console.log(noteData);
                    noteArray.push(noteData);
                    console.log(noteArray); 
                    currentNote = noteData.noteBody;
                    console.log(currentNote);
                  
                     $.alert({
                        theme: 'dark',
                        columnClass: 'col-md-8 col-md-offset-2',
                        title: 'Notes for ' + currentArticle._id + ' article has been saved!',
                        content: 'You wrote: ' + createNote  
                        })     
                    })
                  }
            },
            cancel: function () {
            },
          },
          onContentReady: function () {
              var jc = this;
              this.$content.find('form').on('submit', function (e) {
              // if the user submits the form by pressing enter in the field.
              e.preventDefault();
              jc.$$formSubmit.trigger('click'); // reference the button and click it
              });
          }
        });
        
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
            "<button class='btn note-delete'>x</button>",
            "</li>"
          ].join("")
        );
      
        currentNote.children("button").data("_id", data.notes[i]._id);
        
        notesArray.push(currentNote);
      }
    }
    
    $(".noteDisplay").append(notesArray);
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
      $.confirm({
        columnClass: 'col-md-8 col-md-offset-2',
        title: 'Notes for this article, ' + currentArticle._id + ', has been deleted!',
      })
    });
  }


});

