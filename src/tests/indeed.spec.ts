import { BOARD_URL } from "@data/url";
import { IndeedPage } from "@pages/indeed.page";
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(BOARD_URL.INDEED);
});

test.describe(
  "Indeed",
  {
    annotation: {
      type: "Web Scrapping",
      description:
        "This suite will find all jobs with listed salaries, and list them in a csv file",
    },
  },
  () => {
    test(
      "Search tester jobs",
      {
        tag: ["@indeed"],
      },
      async ({ page }) => {
        const indeedPage = new IndeedPage(page);
        const jobToSearch = "Tester";
        const location = "Canada";
        const jobBoard = "Indeed";
        const maxPagination = 1; // Do not go crazy with this, cloudfare will notice it :)

        // Search the job and save them
        await indeedPage.searchJob(jobToSearch, location);
        const jobDiscovered = await indeedPage.fetchJobDetails(maxPagination);

        expect(jobDiscovered).not.toBe(null);

        // Convert to CSV
        await indeedPage.convertToCSV(
          jobDiscovered,
          jobToSearch,
          jobBoard,
          location
        );
      }
    );
  }
);
