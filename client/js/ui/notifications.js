function createNotification(message, type = 'info', timeout = 5000) {
  let notification = document.createElement('div');
  let id = Math.floor(Math.random() * 0xFFFFFF).toString(16);

  notification.classList.add('notification', type, 'animated', 'fadeInRight');
  notification.innerText = message;
  notification.id = id;

  setTimeout(() => {
    removeNotification(notification);
  }, timeout);

  document.body.appendChild(notification);
}

function success(message, timeout) {
  return createNotification(message, 'success', timeout);
}

function warning(message, timeout) {
  return createNotification(message, 'warning', timeout);
}

function error(message, timeout) {
  return createNotification(message, 'error', timeout);
}


function info(message, timeout) {
  return createNotification(message, 'info', timeout);
}

/**
 * @method removeNotification
 * @param { HTMLDivElement } notification 
 */

function removeNotification(notification) {
  notification.classList.add('fadeOutRight');
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 2000);
}

createNotification.success = success;
createNotification.info = info;
createNotification.error = error;
createNotification.warning = warning;

export default createNotification;