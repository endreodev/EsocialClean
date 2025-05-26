chrome.action.onClicked.addListener(async (tab) => {
  try {
    const cookies = await chrome.cookies.getAll({ domain: "esocial.gov.br" });
    console.log('Cookies found:', cookies.length);

    const removeCookiePromises = cookies.map(async cookie => {
      const cookieUrl = `https://${cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain}${cookie.path}`;
      try {
        await chrome.cookies.remove({
          url: cookieUrl,
          name: cookie.name
        });
        console.log(`Removed cookie: ${cookie.name} from ${cookieUrl}`);
      } catch (err) {
        console.error(`Failed to remove cookie ${cookie.name}:`, err);
      }
    });

    await Promise.all(removeCookiePromises);
    
    await chrome.tabs.update(tab.id, {
      url: "https://login.esocial.gov.br/login.aspx"
    });
  } catch (error) {
    console.error('Error:', error);
  }
  
});
