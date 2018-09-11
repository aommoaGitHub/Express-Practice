$(document).ready(function() {
  $('.delete-reward').on('click', function(e){
    $target = $(e .target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/rewards/'+id,
      success: function(response){
        alert('Delete Reward');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
