import { Page, Locator } from "@playwright/test";
import { BasePage } from "@pages/base.page";
import { Jobs } from "@interface/job";

export class IndeedPage extends BasePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly locationInput: Locator;
  readonly closeDialogButton: Locator;
  readonly jobCards: Locator;
  readonly jobInfo: Locator;
  readonly jobTitle: Locator;
  readonly company: Locator;
  readonly location: Locator;
  readonly navigationNext: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.searchInput = this.page.locator("#text-input-what");
    this.locationInput = this.page.locator("#text-input-where");
    this.closeDialogButton = this.page.locator(
      `div[role="dialog"]  button[aria-label="close"]`
    );
    this.jobCards = this.page.locator("#mosaic-provider-jobcards ul");
    this.jobInfo = this.page.locator("#salaryInfoAndJobType");
    this.jobTitle = this.page.locator(
      '[data-testid="jobsearch-JobInfoHeader-title"]'
    );
    this.company = this.page.locator(
      '[data-testid="inlineHeader-companyName"] a'
    );
    this.location = this.page.locator(
      '[data-testid="inlineHeader-companyLocation"]'
    );
    this.navigationNext = this.page.locator(
      `a[data-testid="pagination-page-next"]`
    );
  }

  /**
   * Closes the dialog window if the close button is visible.
   */
  async closeDialog() {
    // // Forced wait to avoid bans from web scrappers
    await this.page.waitForTimeout(2000);
    if (await this.closeDialogButton.isVisible())
      await this.closeDialogButton.click();
  }

  /**
   * Searches for jobs using the provided job title and location.
   * @param job The job title to search for.
   * @param location The location to search for jobs in.
   */
  async searchJob(job: string, location: string) {
    await this.searchInput.fill(job);
    await this.locationInput.clear();
    await this.locationInput.fill(location);
    await this.page.keyboard.press("Enter");

    await this.closeDialog();
  }

  /**
   * Fetches job details from multiple pages of job listings.
   * @param maxPagination The maximum number of pages to fetch job details from.
   * @returns An array of job details.
   */
  async fetchJobDetails(maxPagination: number): Promise<Jobs[]> {
    let jobs: Jobs[] = [];
    let currentPagination = 1;

    while (currentPagination <= maxPagination) {
      await this.closeDialog();

      for (const li of await this.jobCards
        .locator(`li div[data-testid="slider_item"]`)
        .all()) {
        // Forced wait to avoid bans from web scrappers
        await this.randomWait();
        await li.click();

        // Fetch job data from the opened position
        const jobData: any = {
          title: await this.jobTitle.textContent(),
          company: await this.company.textContent(),
          location: await this.location.textContent(),
          url: this.page.url(),
        };

        // Checks if additional job info (e.g., salary, contract type) is visible
        const salaryElement = await this.jobInfo.isVisible();
        if (salaryElement) jobData.info = await this.jobInfo.textContent();
        else jobData.info = "Additional info not available";

        jobs.push(jobData);
      }

      // Break the loop if reaches the last page
      if (!(await this.navigationNext.isVisible())) break;

      currentPagination++;
      await this.navigationNext.click();
    }

    return jobs;
  }
}
