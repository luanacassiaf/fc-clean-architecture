import CreateProductUseCase from "./create.product.usecase";

const MockRepository = () => {
	return {
		find: jest.fn(),
		findAll: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
	};
};

describe("Unit test create customer use case", () => {
	it("should create a customer", async () => {
		const productRepository = MockRepository();
		const productCreateUseCase = new CreateProductUseCase(productRepository);

		const input = {
			type: "a",
			name: "Product 1",
			price: 100,
		};

		const output = await productCreateUseCase.execute(input);

		expect(output).toEqual({
			id: expect.any(String),
			name: input.name,
			price: input.price,
		});
	});

	it("should thrown an error when name is missing", async () => {
		const productRepository = MockRepository();
		const productCreateUseCase = new CreateProductUseCase(productRepository);

		const input = {
			type: "a",
			name: "",
			price: 100,
		};

		await expect(productCreateUseCase.execute(input)).rejects.toThrow(
			"Name is required"
		);
	});

	it("should thrown an error when price is missing", async () => {
		const productRepository = MockRepository();
		const productCreateUseCase = new CreateProductUseCase(productRepository);

		const input = {
			type: "a",
			name: "Product 1",
			price: -100,
		};

		await expect(productCreateUseCase.execute(input)).rejects.toThrow(
			"Price must be greater than zero"
		);
	});
});
