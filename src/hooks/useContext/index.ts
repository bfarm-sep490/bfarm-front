class ApiContext {
  private data: any;
  private error: string | null = null;

  async fetchData(apiUrl: string): Promise<void> {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      this.data = result;
    } catch (err) {
      this.error = "Failed to fetch data";
    }
  }

  getData(): any {
    return this.data;
  }

  getError(): string | null {
    return this.error;
  }
}

const apiContext = new ApiContext();
export default apiContext;
