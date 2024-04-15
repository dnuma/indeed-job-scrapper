import { Jobs } from "@interface/job";
import { Page } from "@playwright/test";
import { createObjectCsvWriter } from "csv-writer";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Generates a random wait time between 50 and 1500 milliseconds and waits for that duration.
   */
  async randomWait() {
    const waitTime = Math.floor(Math.random() * 1500) + 50;
    await this.page.waitForTimeout(waitTime);
  }

  /**
   * Converts job data to CSV format and saves it to a file.
   * @param jobs An array of job objects to convert to CSV.
   * @param jobTitle The title of the job.
   * @param jobBoard The name of the job board.
   * @param location The location of the job.
   */
  async convertToCSV(
    jobs: Jobs[],
    jobTitle: string,
    jobBoard: string,
    location: string
  ) {
    // Define the CSV file header
    const csvHeader = [
      { id: "title", title: "Title" },
      { id: "company", title: "Company" },
      { id: "location", title: "Location" },
      { id: "info", title: "Info" },
      { id: "url", title: "URL" },
    ];

    const csvWriter = createObjectCsvWriter({
      path: `csv/jobs_${jobTitle}_${location}_${jobBoard}.csv`, // Specify the file path
      header: csvHeader, // Specify the CSV header
    });

    csvWriter
      .writeRecords(jobs)
      .then(() => console.log("CSV file has been written successfully"))
      .catch((error) => console.error("Error writing CSV file:", error));
  }
}
