import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  createViktorAuthJsProvider,
  VIKTOR_PUBLIC_CLIENT_SECRET,
  type ViktorAuthJsProfile,
} from "../src/lib/viktor-spaces-access/authjs";
import {
  getViktorSignInAvailable,
  getViktorSpaceAccessMode,
  getViktorSpacesAuthEnabled,
} from "../src/lib/viktor-spaces-access/config";
import type { ViktorSpaceAccessMode } from "../src/lib/viktor-spaces-access/types";

let convexAuthState = { isAuthenticated: false, isLoading: false };
let convexAuthProviderRenderCount = 0;
const signInMock = mock(async () => ({ signingIn: true }));
const fetchMock = mock();
globalThis.fetch = fetchMock as typeof fetch;
const currentUserQuery = Symbol("currentUser");
const deleteAccountMutation = Symbol("deleteAccount");
const apiMock = {
  api: {
    auth: {
      currentUser: currentUserQuery,
    },
    users: {
      deleteAccount: deleteAccountMutation,
    },
  },
};

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: new MemoryStorage(),
});
Object.defineProperty(globalThis, "sessionStorage", {
  configurable: true,
  value: new MemoryStorage(),
});

mock.module("convex/react", () => ({
  ConvexProviderWithAuth: ({ children }: { children: ReactNode }) => children,
  ConvexReactClient: class {},
  useMutation: () => mock(async () => null),
  useConvexAuth: () => convexAuthState,
  useQuery: () => null,
}));

mock.module("@convex-dev/auth/react", () => ({
  ConvexAuthProvider: ({ children }: { children: ReactNode }) => {
    convexAuthProviderRenderCount += 1;
    return children;
  },
  useAuthActions: () => ({
    signIn: signInMock,
    signOut: mock(async () => null),
  }),
}));

mock.module("../convex/_generated/api", () => apiMock);
mock.module("../../convex/_generated/api", () => apiMock);
mock.module("../../../convex/_generated/api", () => apiMock);

beforeEach(() => {
  convexAuthState = { isAuthenticated: false, isLoading: false };
  convexAuthProviderRenderCount = 0;
  signInMock.mockClear();
  fetchMock.mockReset();
  delete process.env.VIKTOR_SPACES_ACCESS_MODE;
  delete process.env.VIKTOR_SPACES_IS_PREVIEW;
  delete process.env.VIKTOR_AUTH_RESOURCE_ID;
  delete process.env.VIKTOR_AUTH_BASE_URL;
  delete process.env.VIKTOR_AUTH_CLIENT_ID;
  delete process.env.VITE_VIKTOR_SPACES_API_URL;
  process.env.VITE_VIKTOR_SPACES_ACCESS_MODE = "authenticated";
  process.env.VITE_VIKTOR_SPACES_SPACE_ID = "space_stable_123";
});

function configureAccessMode(mode: ViktorSpaceAccessMode): void {
  process.env.VITE_VIKTOR_SPACES_ACCESS_MODE = mode;
}

async function renderProtectedRoute(
  mode: ViktorSpaceAccessMode,
): Promise<string> {
  configureAccessMode(mode);
  const { ProtectedRoute } = await import("../src/components/ProtectedRoute");
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

async function renderAppRoute(
  mode: ViktorSpaceAccessMode,
  path: string,
): Promise<string> {
  configureAccessMode(mode);
  if (mode === "authenticated") {
    const { AuthenticatedAppRoutes } = await import(
      "../src/auth/authenticated/AuthenticatedAppRoutes"
    );
    return renderToStaticMarkup(
      <MemoryRouter initialEntries={[path]}>
        <AuthenticatedAppRoutes />
      </MemoryRouter>,
    );
  }
  const { PublicAppRoutes } = await import(
    "../src/auth/public/PublicAppRoutes"
  );
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <PublicAppRoutes />
    </MemoryRouter>,
  );
}

function viktorProfile(
  overrides: Partial<ViktorAuthJsProfile> = {},
): ViktorAuthJsProfile {
  return {
    sub: "user_1",
    email: "member@example.com",
    name: "Workspace Member",
    resource_type: "space",
    resource_id: "space_123",
    aud: "space:space_123",
    ...overrides,
  };
}

describe("Viktor Spaces auth template contract", () => {
  test("public mode uses a route entrypoint with no auth providers", async () => {
    const html = await renderAppRoute("public", "/");

    expect(html).toContain("Main Headline");
    expect(html).not.toContain("Sign In");
    expect(html).not.toContain("Get Started");
    expect(convexAuthProviderRenderCount).toBe(0);
  });

  test("missing access mode env fails loudly", () => {
    expect(() =>
      getViktorSpaceAccessMode({
        VITE_VIKTOR_SPACES_SPACE_ID: "space_stable_123",
      }),
    ).toThrow("Missing required Viktor Spaces env var");
  });

  test("invalid and legacy access modes fail loudly", () => {
    for (const legacyOrInvalid of ["everyone", "space_auth", "viktor_auth"]) {
      expect(() =>
        getViktorSpaceAccessMode({
          VITE_VIKTOR_SPACES_ACCESS_MODE: legacyOrInvalid,
          VITE_VIKTOR_SPACES_SPACE_ID: "space_stable_123",
        }),
      ).toThrow("Invalid VITE_VIKTOR_SPACES_ACCESS_MODE");
    }
  });

  test("access mode env drives the two supported auth strategies", () => {
    expect(
      getViktorSpaceAccessMode({
        VITE_VIKTOR_SPACES_ACCESS_MODE: "public",
        VITE_VIKTOR_SPACES_SPACE_ID: "space_stable_123",
      }),
    ).toBe("public");
    expect(
      getViktorSpaceAccessMode({
        VITE_VIKTOR_SPACES_ACCESS_MODE: "authenticated",
        VITE_VIKTOR_SPACES_SPACE_ID: "space_stable_123",
      }),
    ).toBe("authenticated");
    expect(
      getViktorSpacesAuthEnabled({
        VITE_VIKTOR_SPACES_ACCESS_MODE: "authenticated",
        VITE_VIKTOR_SPACES_SPACE_ID: "space_stable_123",
      }),
    ).toBe(true);
    expect(
      getViktorSpacesAuthEnabled({
        VITE_VIKTOR_SPACES_ACCESS_MODE: "public",
        VITE_VIKTOR_SPACES_SPACE_ID: "space_stable_123",
      }),
    ).toBe(false);
  });

  test("Convex auth provider registration follows access mode", async () => {
    const { configuredProductAuthEnabled } = await import(
      "../convex/viktorSpaceAuthEnv"
    );

    process.env.VIKTOR_SPACES_ACCESS_MODE = "public";
    expect(configuredProductAuthEnabled()).toBe(false);

    process.env.VIKTOR_SPACES_ACCESS_MODE = "authenticated";
    expect(configuredProductAuthEnabled()).toBe(true);
  });

  test("Convex auth provider registration rejects missing and unknown modes", async () => {
    const { configuredProductAuthEnabled } = await import(
      "../convex/viktorSpaceAuthEnv"
    );

    delete process.env.VIKTOR_SPACES_ACCESS_MODE;
    delete process.env.VITE_VIKTOR_SPACES_ACCESS_MODE;
    expect(() => configuredProductAuthEnabled()).toThrow(
      "Missing required Viktor Spaces env var",
    );

    process.env.VIKTOR_SPACES_ACCESS_MODE = "sometimes";
    expect(() => configuredProductAuthEnabled()).toThrow(
      "Invalid VIKTOR_SPACES_ACCESS_MODE",
    );
  });

  test("Convex auth tolerates transient legacy env values during a v2 upgrade deploy", async () => {
    const { configuredProductAuthEnabled } = await import(
      "../convex/viktorSpaceAuthEnv"
    );

    // An upgraded space's first v2 deploy analyzes these modules while the
    // Convex deployment still carries the old template's env value; the
    // pipeline syncs it to the v2 mode right after the push. The push must
    // not crash in that window.
    for (const legacyMode of ["space_auth", "viktor_auth"]) {
      process.env.VIKTOR_SPACES_ACCESS_MODE = legacyMode;
      expect(configuredProductAuthEnabled()).toBe(true);
    }
  });

  test("authenticated route primitive preserves Convex auth behavior", async () => {
    convexAuthState = { isAuthenticated: true, isLoading: false };
    const authenticatedHtml = await renderProtectedRoute("authenticated");

    expect(authenticatedHtml).toContain("Dashboard content");

    convexAuthState = { isAuthenticated: false, isLoading: false };
    const unauthenticatedHtml = await renderProtectedRoute("authenticated");

    expect(unauthenticatedHtml).not.toContain("Dashboard content");
  });

  test("authenticated mode owns its Convex Auth provider", async () => {
    const html = await renderAppRoute("authenticated", "/login");

    expect(html).toContain("Sign In");
    expect(convexAuthProviderRenderCount).toBe(1);
  });

  test("login page offers Sign in with Viktor when the OAuth config is present", async () => {
    process.env.VITE_VIKTOR_SPACES_API_URL = "https://auth.example";

    const html = await renderAppRoute("authenticated", "/login");

    expect(html).toContain("Sign in with Viktor");
    expect(html).toContain("or continue with email");
  });

  test("Sign in with Viktor is absent without the OAuth client config", async () => {
    delete process.env.VITE_VIKTOR_SPACES_API_URL;

    const html = await renderAppRoute("authenticated", "/login");

    expect(html).not.toContain("Sign in with Viktor");
    expect(html).toContain("Sign In");
  });

  test("OAuth code detection distinguishes successful returns from denials", async () => {
    const { hasOAuthCodeInSearch } = await import("../src/auth/oauthReturn");

    // Successful round trips land with a Convex Auth verification code.
    expect(hasOAuthCodeInSearch("?code=45833532")).toBe(true);
    expect(hasOAuthCodeInSearch("?code=abc&other=1")).toBe(true);
    // Denials land without one.
    expect(hasOAuthCodeInSearch("")).toBe(false);
    expect(hasOAuthCodeInSearch("?error=access_denied")).toBe(false);
  });

  test("OAuth callback routing never fails a sign-in that is still exchanging its code", async () => {
    const { resolveOAuthCallbackDestination } = await import(
      "../src/pages/ViktorOAuthCallbackPage"
    );
    const { LOGIN_FAILED_PATH } = await import("../src/auth/oauthReturn");
    const base = {
      isAuthenticated: false,
      isLoading: false,
      hadOAuthCode: false,
      returnedFromSignIn: false,
      timedOut: false,
    };

    // Landed with a code: stay on the signing-in screen through every
    // transient unauthenticated state (this is the state that used to flash
    // the failure message), even after auth loading settles.
    expect(
      resolveOAuthCallbackDestination({
        ...base,
        hadOAuthCode: true,
        isLoading: true,
      }),
    ).toBeNull();
    expect(
      resolveOAuthCallbackDestination({ ...base, hadOAuthCode: true }),
    ).toBeNull();
    // Exchange finished: straight to the app.
    expect(
      resolveOAuthCallbackDestination({
        ...base,
        hadOAuthCode: true,
        isAuthenticated: true,
      }),
    ).toBe("/dashboard");
    // Exchange stalled past the grace period: explicit failure.
    expect(
      resolveOAuthCallbackDestination({
        ...base,
        hadOAuthCode: true,
        timedOut: true,
      }),
    ).toBe(LOGIN_FAILED_PATH);
    // Denied return (no code, fresh attempt): explicit failure.
    expect(
      resolveOAuthCallbackDestination({ ...base, returnedFromSignIn: true }),
    ).toBe(LOGIN_FAILED_PATH);
    // Stray visit without an attempt: plain login page.
    expect(resolveOAuthCallbackDestination(base)).toBe("/login");
    // Still resolving auth without a code: keep waiting.
    expect(
      resolveOAuthCallbackDestination({ ...base, isLoading: true }),
    ).toBeNull();
  });

  test("OAuth callback route shows a neutral signing-in screen while the code is exchanged", async () => {
    const { ViktorOAuthCallbackPage } = await import(
      "../src/pages/ViktorOAuthCallbackPage"
    );

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/auth/callback"]}>
        <ViktorOAuthCallbackPage hadOAuthCode returnedFromSignIn />
      </MemoryRouter>,
    );

    expect(html).toContain("Signing you in...");
    expect(html).not.toContain("sign in with email and password instead");
  });

  test("login page shows the failure message only with the explicit failure param", async () => {
    process.env.VITE_VIKTOR_SPACES_API_URL = "https://auth.example";
    const { LOGIN_FAILED_PATH } = await import("../src/auth/oauthReturn");

    const failedHtml = await renderAppRoute("authenticated", LOGIN_FAILED_PATH);
    expect(failedHtml).toContain("sign in with email and password instead");

    const plainHtml = await renderAppRoute("authenticated", "/login");
    expect(plainHtml).not.toContain("sign in with email and password instead");
  });

  test("Viktor sign-in availability requires authenticated mode and client config", () => {
    expect(
      getViktorSignInAvailable({
        VITE_VIKTOR_SPACES_ACCESS_MODE: "authenticated",
        VITE_VIKTOR_SPACES_SPACE_ID: "space_stable_123",
        VITE_VIKTOR_SPACES_API_URL: "https://auth.example",
      }),
    ).toBe(true);
    expect(
      getViktorSignInAvailable({
        VITE_VIKTOR_SPACES_ACCESS_MODE: "public",
        VITE_VIKTOR_SPACES_SPACE_ID: "space_stable_123",
        VITE_VIKTOR_SPACES_API_URL: "https://auth.example",
      }),
    ).toBe(false);
    expect(
      getViktorSignInAvailable({
        VITE_VIKTOR_SPACES_ACCESS_MODE: "authenticated",
        VITE_VIKTOR_SPACES_SPACE_ID: "",
        VITE_VIKTOR_SPACES_API_URL: "https://auth.example",
      }),
    ).toBe(false);
    expect(
      getViktorSignInAvailable({
        VITE_VIKTOR_SPACES_ACCESS_MODE: "authenticated",
        VITE_VIKTOR_SPACES_SPACE_ID: "space_stable_123",
        VITE_VIKTOR_SPACES_API_URL: "",
      }),
    ).toBe(false);
  });

  test("Viktor providers register only when the deployment env is configured", async () => {
    const { configuredAuthProviders } = await import(
      "../convex/viktorSpaceAuthConfig"
    );

    process.env.VIKTOR_SPACES_ACCESS_MODE = "authenticated";
    const withoutViktor = configuredAuthProviders();
    expect(
      withoutViktor.some(
        provider => (provider as { id?: string }).id === "viktor",
      ),
    ).toBe(false);

    process.env.VIKTOR_AUTH_RESOURCE_ID = "space_123";
    process.env.VIKTOR_AUTH_BASE_URL = "https://auth.example";
    const withViktor = configuredAuthProviders();
    expect(
      withViktor.some(
        provider => (provider as { id?: string }).id === "viktor",
      ),
    ).toBe(true);

    process.env.VIKTOR_SPACES_ACCESS_MODE = "public";
    expect(configuredAuthProviders()).toEqual([]);
  });

  test("custom Auth.js provider preserves resource and keeps token exchange server-side", () => {
    const provider = createViktorAuthJsProvider({
      clientId: "space-client",
      resourceId: "space_123",
      viktorAuthBaseUrl: "https://auth.example",
    });

    expect(provider.id).toBe("viktor");
    expect(provider.type).toBe("oauth");
    expect(provider.checks).toEqual(["pkce", "state"]);
    // Public client: PKCE protects the exchange; the placeholder secret only
    // satisfies the OAuth client library, the server ignores it.
    expect(provider.client.token_endpoint_auth_method).toBe(
      "client_secret_post",
    );
    expect(provider.clientSecret).toBe(VIKTOR_PUBLIC_CLIENT_SECRET);
    expect(provider.allowDangerousEmailAccountLinking).toBe(true);
    expect(provider.authorization.url).toBe(
      "https://auth.example/api/viktor-auth/authorize",
    );
    expect(provider.authorization.params.resource).toBe("space:space_123");
    expect(provider.token).toBe(
      "https://auth.example/api/viktor-auth/token?resource=space%3Aspace_123",
    );
    expect(provider.userinfo.url).toBe(
      "https://auth.example/api/viktor-auth/userinfo",
    );
  });

  test("provider profile returns only users-schema fields without Viktor tokens", () => {
    const provider = createViktorAuthJsProvider({
      clientId: "space-client",
      resourceId: "space_123",
      viktorAuthBaseUrl: "https://auth.example",
    });

    const profile = provider.profile(viktorProfile());

    expect(profile).toEqual({
      id: "user_1",
      email: "member@example.com",
      name: "Workspace Member",
    });
    expect(JSON.stringify(profile)).not.toContain("access_token");
    expect(JSON.stringify(profile)).not.toContain("refresh_token");
  });

  test("provider profile strips nulls and falls back to preferred_username", () => {
    const provider = createViktorAuthJsProvider({
      clientId: "space-client",
      resourceId: "space_123",
      viktorAuthBaseUrl: "https://auth.example",
    });

    const profile = provider.profile(
      viktorProfile({
        email: null,
        name: null,
        preferred_username: "member@example.com",
      }),
    );

    expect(profile).toEqual({
      id: "user_1",
      email: undefined,
      name: "member@example.com",
    });
  });

  test("provider profile fails closed on a foreign resource", () => {
    const provider = createViktorAuthJsProvider({
      clientId: "space-client",
      resourceId: "space_123",
      viktorAuthBaseUrl: "https://auth.example",
    });

    expect(() =>
      provider.profile(
        viktorProfile({
          resource_id: "space_other",
          aud: "space:space_other",
        }),
      ),
    ).toThrow("different resource");
    expect(() =>
      provider.profile(viktorProfile({ aud: "space:space_other" })),
    ).toThrow("different resource");
    expect(() =>
      provider.profile(viktorProfile({ resource_type: "edge_target" })),
    ).toThrow("different resource");
  });

  test("provider userinfo loads profile with bearer token and fails closed without one", async () => {
    const provider = createViktorAuthJsProvider({
      clientId: "space-client",
      resourceId: "space_123",
      viktorAuthBaseUrl: "https://auth.example",
    });
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          sub: "user_1",
          resource_type: "space",
          resource_id: "space_123",
          aud: "space:space_123",
        }),
        { status: 200 },
      ),
    );

    await expect(
      provider.userinfo.request({ tokens: { access_token: "access-token" } }),
    ).resolves.toEqual({
      sub: "user_1",
      resource_type: "space",
      resource_id: "space_123",
      aud: "space:space_123",
    });
    expect(fetchMock.mock.calls[0]).toEqual([
      "https://auth.example/api/viktor-auth/userinfo",
      { headers: { Authorization: "Bearer access-token" } },
    ]);

    await expect(provider.userinfo.request({ tokens: {} })).rejects.toThrow(
      "requires an access token",
    );
  });
});
