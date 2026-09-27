export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserAuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export interface SaveComponentInstanceInput {
  id?: number;
  instanceKey: string;
  componentType: string;
  coreComponentId?: number;
  coreVariantId?: number;
  props: Record<string, unknown>;
  position: { x: number; y: number };
  orderIndex: number;
}

export interface SavePageInput {
  id?: number;
  name: string;
  path: string;
  components: SaveComponentInstanceInput[];
}

export interface SaveProjectInput {
  projectId?: number;
  name: string;
  description?: string;
  pages: SavePageInput[];
}

export interface ProjectResponse {
  id: number;
  name: string;
  description: string | null;
  pages: {
    id: number;
    name: string;
    path: string;
    components: {
      id: number;
      instanceKey: string;
      componentType: string;
      coreComponentId: number | null;
      coreVariantId: number | null;
      props: Record<string, unknown>;
      position: { x: number; y: number };
      orderIndex: number;
    }[];
  }[];
}
