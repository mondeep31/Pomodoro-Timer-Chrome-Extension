let seconds = 25 * 60;
let timerIsRunning = false;
chrome.alarms.onAlarm.addListener((alarm) => {
  if (!timerIsRunning) {
    return;
  }
  seconds--;

  const remainingMin = Math.floor(seconds / 60) + "M";
  chrome.action.setBadgeText(
    {
      text: remainingMin,
    },
    () => {}
  );

  if (seconds <= 0) {
    clearAlarm("Pomodoro-timer");
    createNotification("Your time has finished, take a break");
    chrome.contextMenus.update("start-timer", {
      title: "Start Timer",
      contexts: ["all"],
    });
    chrome.action.setBadgeText(
      {
        text: "-",
      },
      () => {}
    );
    chrome.action.setBadgeBackgroundColor({ color: "yellow" }, () => {});
  }
});

function createAlarm(name) {
  chrome.alarms.create(name, {
    periodInMinutes: 1 / 60,
  });
}

function createNotification(message) {
  const opt = {
    type: "list",
    title: "Pomodoro Timer",
    message,
    items: [{ title: "Pomodoro Timer", message }],
    iconUrl: "icons/icons48.png",
  };

  chrome.notifications.create(opt);
}

function clearAlarm(name) {
  chrome.alarms.clear(name, (wasCleared) => {
    console.log(wasCleared);
  });
}

chrome.contextMenus.create({
  id: "start-timer",
  title: "Start Timer",
  contexts: ["all"],
});

chrome.contextMenus.create({
  id: "reset-timer",
  title: "Reset Timer",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch (info.menuItemId) {
    case "reset-timer":
      chrome.contextMenus.update("start-timer", {
        title: "Start Timer",
        contexts: ["all"],
      });
      chrome.action.setBadgeText(
        {
          text: "R",
          // ⸺
        },
        () => {}
      );
      clearAlarm("Pomodoro-timer");
      chrome.action.setBadgeBackgroundColor({ color: "green" }, () => {});
      createNotification("Your timer has been reset");
      timerIsRunning = false;
      seconds = 0;

      break;
    case "start-timer":
      if (timerIsRunning) {
        chrome.action.setBadgeText(
          {
            text: "S",
            // ⸺
          },
          () => {}
        );

        chrome.action.setBadgeBackgroundColor({ color: "blue" }, () => {});
        createNotification("Your timer has stopped");
        chrome.contextMenus.update("start-timer", {
          title: "Start Timer",
          contexts: ["all"],
        });
        timerIsRunning = false;
        return;
      }
      seconds = seconds <= 0 ? 25 * 60 : seconds;
      createNotification("Your timer has started");
      timerIsRunning = true;
      createAlarm("Pomodoro-timer");
      chrome.action.setBadgeBackgroundColor({ color: "orange" }, () => {});
      chrome.contextMenus.update("start-timer", {
        title: "Stop Timer",
        contexts: ["all"],
      });
      break;

    default:
      break;
  }
});
chrome.action.setBadgeBackgroundColor({ color: "orange" }, () => {});
