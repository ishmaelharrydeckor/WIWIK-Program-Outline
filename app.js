/**
 * Program Outline & Schedule - SPA Tab Navigation and Live Session Tracker
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Tabs
  const tabSchedule = document.getElementById('tab-schedule');
  const tabSpeakers = document.getElementById('tab-speakers');
  const tabFlyer = document.getElementById('tab-flyer');

  const secSchedule = document.getElementById('schedule');
  const secSpeakers = document.getElementById('speakers');
  const secFlyer = document.getElementById('flyer');

  function showSection(sectionToShow, activeTab) {
    [secSchedule, secSpeakers, secFlyer].forEach(sec => sec.classList.add('hidden'));
    [tabSchedule, tabSpeakers, tabFlyer].forEach(tab => tab.classList.remove('active'));

    sectionToShow.classList.remove('hidden');
    activeTab.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabSchedule.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(secSchedule, tabSchedule);
  });

  tabSpeakers.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(secSpeakers, tabSpeakers);
  });

  tabFlyer.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(secFlyer, tabFlyer);
  });

  // Live Session Highlight Logic
  const timelineItems = document.querySelectorAll('.timeline-item');
  const EVENT_DATE = '2026-06-26'; // Event Date

    if (isManualOverride) return;

    const now = new Date();
    
    // Format current date as YYYY-MM-DD
    const currentDate = now.toISOString().split('T')[0];
    
    // For testing/preview: If it's not the event day, let's simulate the timeline 
    // by highlighting the first session or checking the hours regardless of the day.
    const isEventDay = (currentDate === EVENT_DATE);
    
    // Get current hours and minutes
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeVal = currentHours * 60 + currentMinutes; // minutes since midnight

    let activeSessionFound = false;

    timelineItems.forEach(item => {
      item.classList.remove('active');

      const startAttr = item.getAttribute('data-start');
      const endAttr = item.getAttribute('data-end');

      if (startAttr) {
        const [startH, startM] = startAttr.split(':').map(Number);
        const startTimeVal = startH * 60 + startM;

        let endTimeVal;
        if (endAttr) {
          const [endH, endM] = endAttr.split(':').map(Number);
          endTimeVal = endH * 60 + endM;
        } else {
          // If no end time, assume it lasts 15 minutes or until next session
          endTimeVal = startTimeVal + 15;
        }

        // Check if current time falls within the range
        // If it's not the event day, we still run the time check to allow previewing based on time of day
        if (currentTimeVal >= startTimeVal && currentTimeVal < endTimeVal) {
          item.classList.add('active');
          activeSessionFound = true;
          
          // Smooth scroll the active item into view if it's the event day
          if (isEventDay) {
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    });

    // Default Fallback: If no session is active (e.g. event hasn't started or is over), 
    // and it's not the event day, keep the first session highlighted as a visual preview.
    if (!activeSessionFound && !isEventDay && timelineItems.length > 0) {
      timelineItems[0].classList.add('active');
    }
  }

  // Highlight Tracker Control Panel Buttons
  const btnModeAuto = document.getElementById('btn-mode-auto');
  const btnModeManual = document.getElementById('btn-mode-manual');

  // Handle manual session clicking/override
  let isManualOverride = false;

  function setMode(manual) {
    isManualOverride = manual;
    if (manual) {
      btnModeManual.classList.add('active');
      btnModeAuto.classList.remove('active');
    } else {
      btnModeAuto.classList.add('active');
      btnModeManual.classList.remove('active');
      updateLiveSession();
    }
  }

  btnModeAuto.addEventListener('click', () => setMode(false));
  btnModeManual.addEventListener('click', () => setMode(true));

  timelineItems.forEach(item => {
    // Add visual hand cursor indicator to show timeline items are interactive
    item.style.cursor = 'pointer';

    item.addEventListener('click', () => {
      // Force switch to manual mode on click
      setMode(true);

      // Highlight the clicked item
      timelineItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      // Scroll to center of view
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Run update immediately on load and then every 30 seconds
  updateLiveSession();
  setInterval(updateLiveSession, 30000);
});
