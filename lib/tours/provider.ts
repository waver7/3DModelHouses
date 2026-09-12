export type TourStatus = "PENDING" | "GENERATING" | "READY" | "FAILED";
export interface VirtualTourProvider {
  createProject(input: { name: string }): Promise<{ projectId: string }>;
  uploadImages(projectId: string, images: { url: string }[]): Promise<void>;
  generateTour(projectId: string): Promise<{ jobId: string }>;
  getGenerationStatus(jobId: string): Promise<TourStatus>;
  getPreviewUrl(projectId: string): Promise<string>;
  getEmbedCode(projectId: string): Promise<string>;
  deleteProject(projectId: string): Promise<void>;
}
export class MockVirtualTourProvider implements VirtualTourProvider {
  private projects = new Set<string>();
  async createProject({ name }: { name: string }) { const projectId = `mock-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`; this.projects.add(projectId); return { projectId }; }
  async uploadImages(projectId: string) { if (!this.projects.has(projectId)) throw new Error("Unknown mock project"); }
  async generateTour(projectId: string) { return { jobId: `job-${projectId}` }; }
  async getGenerationStatus() { return "READY" as const; }
  async getPreviewUrl(projectId: string) { return `/tour/${projectId}`; }
  async getEmbedCode(projectId: string) { return `<iframe src="/tour/${projectId}" title="AI-generated property visualization"></iframe>`; }
  async deleteProject(projectId: string) { this.projects.delete(projectId); }
}
