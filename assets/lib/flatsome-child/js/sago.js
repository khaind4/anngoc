jQuery(document).ready(function($) {
  // Chờ 6 giây trước khi thêm class isHideGreeting (nếu nó chưa tồn tại)
  setTimeout(function() {
    var greetingDiv = $('.mbwph-contact-greeting');
    if (!greetingDiv.hasClass('isHideGreeting')) {
      greetingDiv.addClass('isHideGreeting');
    }
  }, 6000);

  // Thêm class isHideGreeting khi click vào div có class mbwph-contact-close-greeting
  $('.mbwph-contact-close-greeting').click(function() {
    var greetingDiv = $('.mbwph-contact-greeting');
    if (!greetingDiv.hasClass('isHideGreeting')) {
      greetingDiv.addClass('isHideGreeting');
    }
  });

// Toggle class isButtonShow khi click vào div.mbwph-button-group-icon
  $('.mbwph-button-group-icon').click(function() {
    if (!$('.mbwph-contact-greeting').hasClass('isHideGreeting')) {
      // Nếu không tồn tại, thêm class isHideGreeting
      $('.mbwph-contact-greeting').addClass('isHideGreeting');
    }
    $('.mbwph-contact-container').toggleClass('isButtonShow');
   
  });
  $('.mbwph-contact-header-close').click(function() {
    $('.mbwph-contact-container').removeClass('isButtonShow');
  });
});
