import {
  SearchParams,
  SearchResult,
} from "../../searchable-repository-contracts";

describe("Searchable Repository unit tests", () => {
  describe("SearchParams tests", () => {
    it("page prop", () => {
      const sut = new SearchParams();
      expect(sut.page).toBe(1);

      const params = [
        { page: null, expected: 1 },
        { page: undefined, expected: 1 },
        { page: "", expected: 1 },
        { page: 0, expected: 1 },
        { page: "test", expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.5, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: [], expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ];

      params.forEach((param) => {
        expect(new SearchParams({ page: param.page as any }).page).toBe(
          param.expected,
        );
      });
    });

    it("perPage prop", () => {
      const sut = new SearchParams();
      expect(sut.perPage).toBe(15);

      const params = [
        { perPage: null, expected: 15 },
        { perPage: undefined, expected: 15 },
        { perPage: "", expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: "test", expected: 15 },
        { perPage: -15, expected: 15 },
        { perPage: 5.5, expected: 15 },
        { perPage: true, expected: 15 },
        { perPage: false, expected: 15 },
        { perPage: {}, expected: 15 },
        { perPage: [], expected: 15 },
        { perPage: 15, expected: 15 },
        { perPage: 30, expected: 30 },
      ];

      params.forEach((param) => {
        expect(
          new SearchParams({ perPage: param.perPage as any }).perPage,
        ).toBe(param.expected);
      });
    });

    it("sort prop", () => {
      const sut = new SearchParams();
      expect(sut.sort).toBeNull();

      const params = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: "", expected: null },
        { sort: "test", expected: "test" },
        { sort: 0, expected: "0" },
        { sort: -15, expected: "-15" },
        { sort: 5.5, expected: "5.5" },
        { sort: true, expected: "true" },
        { sort: false, expected: "false" },
        { sort: {}, expected: "[object Object]" },
        { sort: 15, expected: "15" },
        { sort: 30, expected: "30" },
      ];

      params.forEach((param) => {
        expect(new SearchParams({ sort: param.sort as any }).sort).toBe(
          param.expected,
        );
      });
    });

    it("sortDir prop", () => {
      const sut = new SearchParams();
      expect(sut.sortDir).toBeNull;

      const sortParams = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: "", expected: null },
      ];

      sortParams.forEach((param) => {
        expect(new SearchParams({ sort: param.sort as any }).sortDir).toBeNull;
      });

      const params = [
        { sortDir: null, expected: "desc" },
        { sortDir: undefined, expected: "desc" },
        { sortDir: "", expected: "desc" },
        { sortDir: "test", expected: "desc" },
        { sortDir: 0, expected: "desc" },
        { sortDir: -15, expected: "desc" },
        { sortDir: 5.5, expected: "desc" },
        { sortDir: true, expected: "desc" },
        { sortDir: false, expected: "desc" },
        { sortDir: {}, expected: "desc" },
        { sortDir: "desc", expected: "desc" },
        { sortDir: "asc", expected: "asc" },
        { sortDir: "DESC", expected: "desc" },
        { sortDir: "ASC", expected: "asc" },
      ];

      params.forEach((param) => {
        expect(
          new SearchParams({ sort: "field", sortDir: param.sortDir as any })
            .sortDir,
        ).toBe(param.expected);
      });
    });

    it("filter prop", () => {
      const sut = new SearchParams();
      expect(sut.filter).toBeNull();

      const params = [
        { filter: null, expected: null },
        { filter: undefined, expected: null },
        { filter: "", expected: null },
        { filter: "test", expected: "test" },
        { filter: 0, expected: "0" },
        { filter: -15, expected: "-15" },
        { filter: 5.5, expected: "5.5" },
        { filter: true, expected: "true" },
        { filter: false, expected: "false" },
        { filter: {}, expected: "[object Object]" },
        { filter: 15, expected: "15" },
        { filter: 30, expected: "30" },
      ];

      params.forEach((param) => {
        expect(new SearchParams({ filter: param.filter as any }).filter).toBe(
          param.expected,
        );
      });
    });
  });

  describe("SearchResult tests", () => {
    describe("Constructor props", () => {
      let sut = new SearchResult({
        items: ["test1", "test2", "test3", "test4"] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });
      it("Should create a result with given params and without sort params", () => {
        expect(sut.toJSON()).toStrictEqual({
          items: ["test1", "test2", "test3", "test4"] as any,
          total: 4,
          currentPage: 1,
          lastPage: 2,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: null,
        });
      });

      it("Should create a result with given params and without sort params", () => {
        sut = new SearchResult({
          items: ["test1", "test2", "test3", "test4"] as any,
          total: 4,
          currentPage: 1,
          perPage: 2,
          sort: "name",
          sortDir: "desc",
          filter: "test",
        });

        expect(sut.toJSON()).toStrictEqual({
          items: ["test1", "test2", "test3", "test4"] as any,
          total: 4,
          currentPage: 1,
          lastPage: 2,
          perPage: 2,
          sort: "name",
          sortDir: "desc",
          filter: "test",
        });
      });

      test("lastPage should result 1 if perPage is greater than total results", () => {
        sut = new SearchResult({
          items: ["test1", "test2", "test3", "test4"] as any,
          total: 4,
          currentPage: 1,
          perPage: 10,
          sort: "name",
          sortDir: "desc",
          filter: "test",
        });

        expect(sut.lastPage).toBe(1);
      });

      test("lastPage should result next interger number when dividing", () => {
        sut = new SearchResult({
          items: ["test1", "test2", "test3", "test4"] as any,
          total: 54,
          currentPage: 1,
          perPage: 10,
          sort: "name",
          sortDir: "desc",
          filter: "test",
        });

        expect(sut.lastPage).toBe(6);
      });
    });
  });
});
