// Mock database service using localStorage
// Simulates HTTP API calls but uses localStorage as the data store

interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

interface BeerReview {
  id: number;
  user_id: number;
  name: string;
  image: string;
  rating: number;
  comments: string;
  date_added: Date;
}

// Simulate network delay
const simulateNetworkDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 300));

// Helper functions for localStorage management
const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem("brewreviews_users");
    return users
      ? JSON.parse(users).map((user: any) => ({
          ...user,
          created_at: new Date(user.created_at),
        }))
      : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem("brewreviews_users", JSON.stringify(users));
};

const getBeerReviews = (): BeerReview[] => {
  try {
    const reviews = localStorage.getItem("brewreviews_beer_reviews");
    return reviews
      ? JSON.parse(reviews).map((review: any) => ({
          ...review,
          date_added: new Date(review.date_added),
        }))
      : [];
  } catch {
    return [];
  }
};

const saveBeerReviews = (reviews: BeerReview[]) => {
  localStorage.setItem("brewreviews_beer_reviews", JSON.stringify(reviews));
};

const getNextUserId = (): number => {
  const users = getUsers();
  return users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
};

const getNextReviewId = (): number => {
  const reviews = getBeerReviews();
  return reviews.length > 0 ? Math.max(...reviews.map((r) => r.id)) + 1 : 1;
};

// Initialize database (no-op for localStorage)
export async function initDatabase() {
  await simulateNetworkDelay();
  console.log("Mock database initialized (using localStorage)");
  return Promise.resolve();
}

// User operations
export async function createUser(email: string, name: string): Promise<User> {
  await simulateNetworkDelay();

  const users = getUsers();
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return existingUser;
  }

  const newUser: User = {
    id: getNextUserId(),
    email,
    name,
    created_at: new Date(),
  };

  users.push(newUser);
  saveUsers(users);

  return newUser;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await simulateNetworkDelay();

  const users = getUsers();
  return users.find((u) => u.email === email) || null;
}

// Beer review operations
export async function createBeerReview(
  userId: number,
  beerData: {
    name: string;
    image: string;
    rating: number;
    comments: string;
  },
): Promise<BeerReview> {
  await simulateNetworkDelay();

  const reviews = getBeerReviews();
  const newReview: BeerReview = {
    id: getNextReviewId(),
    user_id: userId,
    name: beerData.name,
    image: beerData.image,
    rating: beerData.rating,
    comments: beerData.comments,
    date_added: new Date(),
  };

  reviews.push(newReview);
  saveBeerReviews(reviews);

  return newReview;
}

export async function getBeerReviewsByUser(
  userId: number,
): Promise<BeerReview[]> {
  await simulateNetworkDelay();

  const reviews = getBeerReviews();
  return reviews.filter((r) => r.user_id === userId);
}

export async function getBeerReviewById(
  id: number,
  userId: number,
): Promise<BeerReview | null> {
  await simulateNetworkDelay();

  const reviews = getBeerReviews();
  return reviews.find((r) => r.id === id && r.user_id === userId) || null;
}

export async function updateBeerReview(
  id: number,
  userId: number,
  beerData: {
    name: string;
    image: string;
    rating: number;
    comments: string;
  },
): Promise<BeerReview | null> {
  await simulateNetworkDelay();

  const reviews = getBeerReviews();
  const reviewIndex = reviews.findIndex(
    (r) => r.id === id && r.user_id === userId,
  );

  if (reviewIndex === -1) return null;

  reviews[reviewIndex] = {
    ...reviews[reviewIndex],
    name: beerData.name,
    image: beerData.image,
    rating: beerData.rating,
    comments: beerData.comments,
  };

  saveBeerReviews(reviews);
  return reviews[reviewIndex];
}

export async function deleteBeerReview(
  id: number,
  userId: number,
): Promise<{ id: number } | null> {
  await simulateNetworkDelay();

  const reviews = getBeerReviews();
  const reviewIndex = reviews.findIndex(
    (r) => r.id === id && r.user_id === userId,
  );

  if (reviewIndex === -1) return null;

  const deletedReview = reviews[reviewIndex];
  reviews.splice(reviewIndex, 1);
  saveBeerReviews(reviews);

  return { id: deletedReview.id };
}
