export class PlanNotFoundError extends Error {
  constructor(id: string) {
    super(`Plan with ID ${id} was not found.`);
    this.name = "PlanNotFoundError";
  }
}

export class PlanAlreadyArchivedError extends Error {
  constructor(id: string) {
    super(`Plan with ID ${id} is already archived.`);
    this.name = "PlanAlreadyArchivedError";
  }
}
