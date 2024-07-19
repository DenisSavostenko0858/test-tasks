$(document).ready(function() {
    // Initialize date picker
    $('#date-picker').datepicker({
      onSelect: function(dateText) {
        loadTasksByDate(dateText);
      }
    });
  
    // Load tasks for current date by default
    loadTasksByDate(getCurrentDate());
  
    // Attach event listeners
    $('#today-button').click(function() {
      loadTasksByDate(getCurrentDate());
    });
  
    $('#week-button').click(function() {
      loadTasksByWeek();
    });
  
    $('#sort-select').change(function() {
      loadTasks();
    });
  
    $('#show-incomplete').change(function() {
      loadTasks();
    });
  
    $('#search-input').on('input', function() {
      searchTasks();
    });
  
    $('#search-results').on('click', 'li', function() {
      showTaskDetails($(this).data('task-id'));
    });
  
    $('.close-button').click(function() {
      $('#task-modal').hide();
    });
  });
  
  function getCurrentDate() {
    var today = new Date();
    return today.toISOString().slice(0, 10);
  }
  
  function loadTasksByDate(date) {
    // Fetch tasks for the selected date from the API
    $.ajax({
      url: 'https://todo.doczilla.pro/api/tasks?date=' + date,
      success: function(data) {
        displayTasks(data);
      }
    });
  }
  
  function loadTasksByWeek() {
    // Fetch tasks for the current week from the API
    var startDate = getStartOfWeek(new Date());
    var endDate = getEndOfWeek(new Date());
    $.ajax({
      url: 'https://todo.doczilla.pro/api/tasks?start_date=' + startDate + '&end_date=' + endDate,
      success: function(data) {
        displayTasks(data);
      }
    });
  }
  
  function loadTasks() {
    // Fetch tasks based on the selected filters (sort and status)
    var sortOrder = $('#sort-select').val();
    var showIncomplete = $('#show-incomplete').is(':checked');
    $.ajax({
      url: 'https://todo.doczilla.pro/api/tasks?sort=' + sortOrder + '&show_incomplete=' + showIncomplete,
      success: function(data) {
        displayTasks(data);
      }
    });
  }
  
  function searchTasks() {
    // Search for tasks based on the input in the search field
    var searchQuery = $('#search-input').val();
    $.ajax({
      url: 'https://todo.doczilla.pro/api/tasks?search=' + searchQuery,
      success: function(data) {
        displaySearchResults(data);
      }
    });
  }
  
  function showTaskDetails(taskId) {
    // Fetch the details of the selected task and display them in the modal
    $.ajax({
      url: 'https://todo.doczilla.pro/api/tasks/' + taskId,
      success: function(data) {
        $('#modal-title').text(data.title);
        $('#modal-description').text(data.description);
        $('#modal-due-date').text(data.due_date);
        $('#modal-status').text(data.status);
        $('#task-modal').show();
      }
    });
  }
  
  // Helper functions for date manipulation
  function getStartOfWeek(date) {
    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    return new Date(date.setDate(diff)).toISOString().slice(0, 10);
  }
  
  function getEndOfWeek(date) {
    var diff = date.getDate() + (7 - date.getDay());
    return new Date(date.setDate(diff)).toISOString().slice(0, 10);
  }