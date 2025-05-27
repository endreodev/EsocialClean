browser.browserAction.onClicked.addListener(async (tab) => {
  try {
    const domains = ["esocial.gov.br", "login.esocial.gov.br"];
    for (const domain of domains) {
      const cookies = await browser.cookies.getAll({ domain });
      console.log(`Cookies found for ${domain}:`, cookies.length);

      for (const cookie of cookies) {
        const cookieUrl = `https://${cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain}${cookie.path}`;
        try {
          await browser.cookies.remove({
            url: cookieUrl,
            name: cookie.name,
            storeId: cookie.storeId
          });
          console.log(`Removed cookie: ${cookie.name} from ${cookieUrl}`);
        } catch (err) {
          console.error(`Failed to remove cookie ${cookie.name}:`, err);
        }
      }
    }
    
    await browser.tabs.update(tab.id, {
      url: "https://login.esocial.gov.br/login.aspx"
    });
  } catch (error) {
    console.error('Error:', error);
  }
});